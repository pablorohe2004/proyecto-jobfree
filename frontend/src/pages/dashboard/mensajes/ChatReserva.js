import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { obtenerConversacion, obtenerConversacionPorReserva } from "api/conversaciones";
import { enviarMensaje, marcarMensajesLeidos, marcarMensajesRecibidos, obtenerMensajesDeConversacion } from "api/mensajes";
import { useAuth } from "context/AuthContext";
import { useChatSocket } from "context/ChatSocketContext";

function generarClientMessageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function compareMensajes(a, b) {
  const fechaA = new Date(a.fechaEnvio).getTime();
  const fechaB = new Date(b.fechaEnvio).getTime();

  if (fechaA !== fechaB) return fechaA - fechaB;

  return Number(a.id || 0) - Number(b.id || 0);
}

function estadoTimestampMs(estado) {
  if (!estado?.timestamp) return 0;
  const parsed = new Date(estado.timestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mergeEstadoFinal(actual, estado) {
  if (!estado) return actual;

  const actualTs = estadoTimestampMs({ timestamp: actual?._estadoTimestamp });
  const nuevoTs = estadoTimestampMs(estado);
  const tsFinal = Math.max(actualTs, nuevoTs);
  const leido = Boolean(actual?.leido || estado?.leido);
  const recibido = Boolean(actual?.recibido || estado?.recibido || leido);

  return {
    ...actual,
    leido,
    recibido,
    _estadoTimestamp: tsFinal > 0 ? new Date(tsFinal).toISOString() : actual?._estadoTimestamp,
  };
}

function normalizarEstadosEvento(evento) {
  if (Array.isArray(evento?.mensajes) && evento.mensajes.length > 0) {
    return evento.mensajes
      .filter((mensaje) => mensaje?.id)
      .map((mensaje) => ({
        id: Number(mensaje.id),
        leido: Boolean(mensaje.leido),
        recibido: Boolean(mensaje.recibido),
        timestamp: mensaje.timestamp,
      }));
  }

  if (evento?.tipo === "mensaje.leido.lote" && Array.isArray(evento?.mensajeIds)) {
    return evento.mensajeIds.map((id) => ({ id: Number(id), leido: true, recibido: true }));
  }

  if (evento?.tipo === "mensaje.recibido.lote" && Array.isArray(evento?.mensajeIds)) {
    return evento.mensajeIds.map((id) => ({ id: Number(id), leido: false, recibido: true }));
  }

  if (evento?.tipo === "mensaje.leido" && evento?.mensajeId) {
    return [{ id: Number(evento.mensajeId), leido: true, recibido: true }];
  }

  if (evento?.tipo === "mensaje.recibido" && evento?.mensajeId) {
    return [{ id: Number(evento.mensajeId), leido: false, recibido: true }];
  }

  return [];
}

function mergeMensajes(actuales, nuevos) {
  const mapa = new Map(actuales.map((mensaje) => [mensaje.id, mensaje]));

  nuevos.forEach((mensaje) => {
    const previo = mapa.get(mensaje.id);
    mapa.set(mensaje.id, { ...previo, ...mensaje });
  });

  return Array.from(mapa.values()).sort(compareMensajes);
}

function upsertMensaje(actuales, mensaje) {
  const existe = actuales.some((item) => (
    Number(item.id) === Number(mensaje.id)
    || (item.clientMessageId && mensaje.clientMessageId && item.clientMessageId === mensaje.clientMessageId)
  ));
  if (existe) {
    return actuales.map((item) => (
      Number(item.id) === Number(mensaje.id)
      || (item.clientMessageId && mensaje.clientMessageId && item.clientMessageId === mensaje.clientMessageId)
        ? { ...item, ...mensaje }
        : item
    ));
  }

  return [...actuales, mensaje].sort(compareMensajes);
}

function ChatReserva() {
  const { reservaId, conversacionId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { subscribeToConversation, connected, connectionState, reconnectVersion } = useChatSocket();

  const [conversacion, setConversacion] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const lastReconnectHandledRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);
  const pendingSendKeyRef = useRef(null);
  const retryClientMessageIdsRef = useRef(new Map());
  const previousMessageCountRef = useRef(0);
  const pendingEstadosRef = useRef(new Map());

  function actualizarEstadoScroll() {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    shouldAutoScrollRef.current = scrollHeight - (scrollTop + clientHeight) < 120;
  }

  const aplicarEstadosPendientes = useCallback((listaMensajes) => {
    if (pendingEstadosRef.current.size === 0) {
      return listaMensajes;
    }

    return listaMensajes.map((mensaje) => {
      const pendiente = pendingEstadosRef.current.get(Number(mensaje.id));
      if (!pendiente) return mensaje;

      pendingEstadosRef.current.delete(Number(mensaje.id));
      return mergeEstadoFinal(mensaje, pendiente);
    });
  }, []);

  const aplicarEventoDeEstado = useCallback((listaMensajes, evento) => {
    const estados = normalizarEstadosEvento(evento);
    if (estados.length === 0) return listaMensajes;

    const estadosPorId = new Map(estados.map((estado) => [Number(estado.id), estado]));
    const actualizados = listaMensajes.map((mensaje) => {
      const estado = estadosPorId.get(Number(mensaje.id));
      if (!estado) return mensaje;
      estadosPorId.delete(Number(mensaje.id));
      return mergeEstadoFinal(mensaje, estado);
    });

    estadosPorId.forEach((estado, id) => {
      const previo = pendingEstadosRef.current.get(id);
      pendingEstadosRef.current.set(id, mergeEstadoFinal(previo ?? {}, estado));
    });

    return actualizados;
  }, []);

  const marcarPendientesComoRecibidos = useCallback(async (listaMensajes) => {
    const pendientes = listaMensajes.filter(
      (mensaje) => Number(mensaje.destinatarioId) === Number(usuario?.id) && !mensaje.recibido
    );

    if (pendientes.length === 0) return;

    await marcarMensajesRecibidos(pendientes.map((mensaje) => mensaje.id));

    setMensajes((prev) => prev.map((mensaje) => (
      pendientes.some((pendiente) => pendiente.id === mensaje.id)
        ? { ...mensaje, recibido: true }
        : mensaje
    )));
  }, [usuario?.id]);

  const marcarPendientesComoLeidos = useCallback(async (listaMensajes) => {
    const pendientes = listaMensajes.filter(
      (mensaje) => Number(mensaje.destinatarioId) === Number(usuario?.id) && !mensaje.leido
    );

    if (pendientes.length === 0) return;

    await marcarMensajesLeidos(pendientes.map((mensaje) => mensaje.id));

    setMensajes((prev) => prev.map((mensaje) => (
      pendientes.some((pendiente) => pendiente.id === mensaje.id)
        ? { ...mensaje, leido: true }
        : mensaje
    )));
  }, [usuario?.id]);

  useEffect(() => {
    let activo = true;

    async function cargarConversacion() {
      try {
        const data = reservaId
          ? await obtenerConversacionPorReserva(reservaId)
          : await obtenerConversacion(conversacionId);
        if (activo) setConversacion(data);
      } catch (err) {
        if (activo) {
          setError(err.message || "No se pudo abrir la conversación.");
          setLoading(false);
        }
      }
    }

    cargarConversacion();
    return () => { activo = false; };
  }, [reservaId, conversacionId]);

  useEffect(() => {
    if (!conversacion?.id) return undefined;

    let cancelado = false;

    async function cargarMensajes() {
      try {
        const data = await obtenerMensajesDeConversacion(conversacion.id);
        if (cancelado) return;

        setMensajes((prev) => aplicarEstadosPendientes(mergeMensajes(prev, data)));
        setLoading(false);
        await marcarPendientesComoRecibidos(data);
        await marcarPendientesComoLeidos(data);
      } catch (err) {
        if (!cancelado) {
          setError(err.message || "No se pudieron cargar los mensajes.");
          setLoading(false);
        }
      }
    }

    cargarMensajes();
    const interval = connected ? null : window.setInterval(cargarMensajes, 5000);

    return () => {
      cancelado = true;
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [conversacion?.id, usuario?.id, connected, marcarPendientesComoLeidos, marcarPendientesComoRecibidos, aplicarEstadosPendientes]);

  useEffect(() => {
    if (!conversacion?.id || !connected || reconnectVersion === 0) return;
    if (lastReconnectHandledRef.current === reconnectVersion) return;

    lastReconnectHandledRef.current = reconnectVersion;

    obtenerMensajesDeConversacion(conversacion.id)
      .then((data) => {
        setMensajes((prev) => aplicarEstadosPendientes(mergeMensajes(prev, data)));
        return marcarPendientesComoRecibidos(data)
          .then(() => marcarPendientesComoLeidos(data));
      })
      .catch(() => {});
  }, [conversacion?.id, connected, reconnectVersion, marcarPendientesComoLeidos, marcarPendientesComoRecibidos, aplicarEstadosPendientes]);

  useEffect(() => {
    if (!conversacion?.id) return undefined;

    return subscribeToConversation(conversacion.id, (evento) => {
      if (evento?.tipo === "mensaje.nuevo" && evento.mensaje) {
        setMensajes((prev) => aplicarEstadosPendientes(upsertMensaje(prev, evento.mensaje)));

        if (Number(evento.mensaje.destinatarioId) === Number(usuario?.id)) {
          if (!evento.mensaje.recibido) {
            marcarMensajesRecibidos([evento.mensaje.id]).catch(() => {});
          }
          if (!evento.mensaje.leido) {
            marcarMensajesLeidos([evento.mensaje.id]).catch(() => {});
          }
        }
      }

      if (
        evento?.tipo === "mensaje.recibido"
        || evento?.tipo === "mensaje.recibido.lote"
        || evento?.tipo === "mensaje.leido"
        || evento?.tipo === "mensaje.leido.lote"
      ) {
        setMensajes((prev) => aplicarEventoDeEstado(prev, evento));
      }

      if (evento?.tipo === "conversacion.actualizada" && evento.conversacion) {
        setConversacion((prev) => ({ ...prev, ...evento.conversacion }));
      }
    });
  }, [conversacion?.id, subscribeToConversation, usuario?.id, aplicarEstadosPendientes, aplicarEventoDeEstado]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const ultimoMensaje = mensajes[mensajes.length - 1];
    const esMio = Number(ultimoMensaje?.remitenteId) === Number(usuario?.id);
    const crecieron = mensajes.length > previousMessageCountRef.current;

    if (shouldAutoScrollRef.current || (crecieron && esMio)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    previousMessageCountRef.current = mensajes.length;
  }, [mensajes, usuario?.id]);

  const dashboardBase = usuario?.rol?.toUpperCase() === "PROFESIONAL"
    ? "/dashboard/profesional"
    : "/dashboard/cliente";

  const otraPersona = useMemo(() => {
    if (!conversacion || !usuario?.id) return null;

    const soyCliente = Number(conversacion.clienteId) === Number(usuario.id);

    return {
      id: soyCliente ? conversacion.profesionalId : conversacion.clienteId,
      nombre: soyCliente ? conversacion.profesionalNombre : conversacion.clienteNombre,
    };
  }, [conversacion, usuario?.id]);

  async function handleEnviar(e) {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || !conversacion || !otraPersona) return;

    const sendKey = `${conversacion.id}:${otraPersona.id}:${contenido}`;
    if (sending || pendingSendKeyRef.current === sendKey) return;
    const clientMessageId = retryClientMessageIdsRef.current.get(sendKey) ?? generarClientMessageId();

    setSending(true);
    setError("");
    pendingSendKeyRef.current = sendKey;
    retryClientMessageIdsRef.current.set(sendKey, clientMessageId);
    shouldAutoScrollRef.current = true;

    try {
      const nuevo = await enviarMensaje({
        contenido,
        destinatarioId: otraPersona.id,
        conversacionId: conversacion.id,
        clientMessageId,
      });
      setMensajes((prev) => aplicarEstadosPendientes(upsertMensaje(prev, nuevo)));
      setTexto("");
      retryClientMessageIdsRef.current.delete(sendKey);
    } catch (err) {
      setError(err.message || "No se pudo enviar el mensaje.");
    } finally {
      pendingSendKeyRef.current = null;
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando conversación...
      </div>
    );
  }

  if (error && !conversacion) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(`${dashboardBase}/mensajes`)}
          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-slate-900">{otraPersona?.nombre}</h1>
          <p className="text-xs text-slate-500">{conversacion?.servicioTitulo}</p>
          <p className={`mt-1 text-[11px] ${
            connectionState === "connected"
              ? "text-emerald-600"
              : connectionState === "reconnecting"
                ? "text-amber-600"
                : "text-slate-400"
          }`}>
            {connectionState === "connected"
              ? "Conectado en tiempo real"
              : connectionState === "reconnecting"
                ? "Reconectando..."
                : "Sin conexión en tiempo real"}
          </p>
        </div>
      </div>

      <div ref={scrollRef} onScroll={actualizarEstadoScroll} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
        {mensajes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
            {conversacion?.reservaId
              ? "La conversación está lista. Envía el primer mensaje relacionado con esta reserva."
              : "La conversación está lista. Cuéntale al profesional qué necesitas."}
          </div>
        ) : (
          mensajes.map((mensaje) => {
            const esMio = Number(mensaje.remitenteId) === Number(usuario?.id);

            return (
              <div key={mensaje.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    esMio
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{mensaje.contenido}</p>
                  <p className={`mt-2 text-[11px] ${esMio ? "text-emerald-50" : "text-slate-400"}`}>
                    {formatearHora(mensaje.fechaEnvio)}
                    {esMio ? ` · ${mensaje.leido ? "Leído" : mensaje.recibido ? "Recibido" : "Enviado"}` : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleEnviar} className="border-t border-slate-200 px-4 py-4">
        {error && conversacion && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-end gap-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={2}
            placeholder={conversacion?.reservaId
              ? "Escribe un mensaje sobre esta reserva..."
              : "Escribe un mensaje para iniciar el trabajo..."}
            className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="submit"
            disabled={sending || !texto.trim()}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatReserva;
