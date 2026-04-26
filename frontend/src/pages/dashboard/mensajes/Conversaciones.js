import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { obtenerMisConversaciones } from "api/conversaciones";
import { marcarMensajesRecibidos } from "api/mensajes";
import { useAuth } from "context/AuthContext";
import { useChatSocket } from "context/ChatSocketContext";
import API_URL from "api/config";

function formatearFecha(fecha) {
  if (!fecha) return "Sin mensajes todavía";
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TarjetaConversacion({ conversacion, dashboardBase, usuarioId }) {
  const navigate = useNavigate();
  const esCliente = Number(conversacion.clienteId) === Number(usuarioId);
  const nombreOtraPersona = esCliente ? conversacion.profesionalNombre : conversacion.clienteNombre;
  const fotoOtraPersona = esCliente ? conversacion.profesionalFotoUrl : conversacion.clienteFotoUrl;
  const foto = fotoOtraPersona
    ? (fotoOtraPersona.startsWith("http") ? fotoOtraPersona : API_URL + fotoOtraPersona)
    : null;

  const iniciales = (nombreOtraPersona ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => navigate(
        conversacion.reservaId
          ? `${dashboardBase}/mensajes/reserva/${conversacion.reservaId}`
          : `${dashboardBase}/mensajes/${conversacion.id}`
      )}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {foto ? (
          <img src={foto} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
            {iniciales}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{nombreOtraPersona}</p>
              <p className="truncate text-xs text-slate-500">{conversacion.servicioTitulo || "Contacto inicial"}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{formatearFecha(conversacion.fechaUltimoMensaje)}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-slate-600">
            {conversacion.ultimoMensaje || "La conversación está preparada para este servicio."}
          </p>
        </div>
      </div>
    </button>
  );
}

function upsertConversacion(lista, actualizada) {
  const resto = lista.filter((item) => Number(item.id) !== Number(actualizada.id));
  return [actualizada, ...resto].sort((a, b) => {
    const fechaA = new Date(a.fechaUltimoMensaje || a.fechaCreacion || 0).getTime();
    const fechaB = new Date(b.fechaUltimoMensaje || b.fechaCreacion || 0).getTime();
    return fechaB - fechaA;
  });
}

function Conversaciones() {
  const { usuario } = useAuth();
  const { subscribeToUserQueue, connectionState } = useChatSocket();
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargar(silencioso = false) {
      if (!silencioso) setLoading(true);
      try {
        const data = await obtenerMisConversaciones();
        if (activo) setConversaciones(data);
      } catch {
        if (activo) setError("No se pudieron cargar tus conversaciones.");
      } finally {
        if (activo && !silencioso) setLoading(false);
      }
    }

    cargar();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    return subscribeToUserQueue((evento) => {
      if (evento?.tipo === "conversacion.actualizada" && evento.conversacion) {
        setConversaciones((prev) => upsertConversacion(prev, evento.conversacion));
        return;
      }

      if (evento?.tipo === "usuario.mensajes.actualizados" && evento.conversacionId) {
        if (
          evento.actualizacionTipo === "mensaje.recibido.lote"
          || evento.actualizacionTipo === "mensaje.leido.lote"
        ) {
          obtenerMisConversaciones()
            .then(setConversaciones)
            .catch(() => {});
        }
        return;
      }

      if (evento?.tipo === "mensaje.nuevo" && evento.mensaje?.conversacionId) {
        if (Number(evento.mensaje.destinatarioId) === Number(usuario?.id) && !evento.mensaje.recibido) {
          marcarMensajesRecibidos([evento.mensaje.id]).catch(() => {});
        }
        obtenerMisConversaciones()
          .then(setConversaciones)
          .catch(() => {});
        return;
      }

      if (evento?.tipo === "mensaje.leido" && evento.conversacionId) {
        obtenerMisConversaciones()
          .then(setConversaciones)
          .catch(() => {});
        return;
      }

      if (evento?.tipo === "mensaje.leido.lote" && evento.conversacionId) {
        obtenerMisConversaciones()
          .then(setConversaciones)
          .catch(() => {});
      }
    });
  }, [subscribeToUserQueue, usuario?.id]);

  const dashboardBase = usuario?.rol?.toUpperCase() === "PROFESIONAL"
    ? "/dashboard/profesional"
    : "/dashboard/cliente";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando conversaciones...
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Mensajes</h1>
        <p className="mt-1 text-sm text-slate-500">Conversaciones activas con profesionales y chats ligados a reservas.</p>
        <p className={`mt-2 text-xs ${
          connectionState === "connected"
            ? "text-emerald-600"
            : connectionState === "reconnecting"
              ? "text-amber-600"
              : "text-slate-400"
        }`}>
          {connectionState === "connected"
            ? "Tiempo real conectado"
            : connectionState === "reconnecting"
              ? "Reconectando mensajería en tiempo real..."
              : "Tiempo real desconectado"}
        </p>
      </div>

      {conversaciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <ChatBubbleLeftRightIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Todavía no tienes conversaciones.</p>
          <p className="mt-1 text-xs text-slate-400">Se crearán cuando contactes con un profesional o exista una reserva.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {conversaciones.map((conversacion) => (
            <TarjetaConversacion
              key={conversacion.id}
              conversacion={conversacion}
              dashboardBase={dashboardBase}
              usuarioId={usuario?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Conversaciones;
