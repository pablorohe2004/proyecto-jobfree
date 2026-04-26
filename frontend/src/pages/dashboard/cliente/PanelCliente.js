import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  SparklesIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { obtenerMisReservas } from "api/reservas";
import { obtenerMisConversaciones } from "api/conversaciones";
import { obtenerServiciosActivos } from "api/servicios";
import { useAuth } from "context/AuthContext";

function formatearFecha(fecha) {
  if (!fecha) return "Fecha pendiente";
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Seccion({ titulo, descripcion, icono: Icono, children, enlace, textoEnlace }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Icono className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
            <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
          </div>
        </div>
        {enlace && textoEnlace && (
          <Link to={enlace} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            {textoEnlace}
          </Link>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-8 text-sm text-slate-500">
      {texto}
    </div>
  );
}

function PanelCliente() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [conversaciones, setConversaciones] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    Promise.allSettled([
      obtenerMisReservas(),
      obtenerMisConversaciones(),
      obtenerServiciosActivos(0, 6),
    ]).then(([reservasRes, conversacionesRes, recomendadosRes]) => {
      if (!activo) return;
      setReservas(reservasRes.status === "fulfilled" ? reservasRes.value : []);
      setConversaciones(conversacionesRes.status === "fulfilled" ? conversacionesRes.value : []);
      setRecomendados(recomendadosRes.status === "fulfilled" ? (recomendadosRes.value?.content || []) : []);
      setLoading(false);
    });

    return () => {
      activo = false;
    };
  }, []);

  const proximasCitas = useMemo(() => (
    reservas
      .filter((item) => ["PENDIENTE", "CONFIRMADA"].includes(item.estado))
      .sort((a, b) => new Date(a.fechaInicio || a.fechaCreacion) - new Date(b.fechaInicio || b.fechaCreacion))
      .slice(0, 3)
  ), [reservas]);

  const mensajesRecientes = useMemo(() => (
    conversaciones
      .slice()
      .sort((a, b) => new Date(b.fechaUltimoMensaje || b.fechaCreacion || 0) - new Date(a.fechaUltimoMensaje || a.fechaCreacion || 0))
      .slice(0, 4)
  ), [conversaciones]);

  const pendientesValorar = useMemo(() => (
    reservas.filter((item) => item.estado === "COMPLETADA" && !item.valorada).slice(0, 3)
  ), [reservas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando tu panel...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-500 via-emerald-500 to-cyan-500 px-7 py-8 text-white shadow-lg">
        <p className="text-sm font-medium text-white/80">Panel cliente</p>
        <h1 className="mt-2 text-3xl font-semibold">Bienvenido, {usuario?.nombre ?? "cliente"} 👋</h1>
        <p className="mt-2 text-sm text-white/85">¿Qué necesitas hoy?</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Seccion
          titulo="Próximas citas"
          descripcion="Tus servicios en marcha y próximas confirmaciones."
          icono={CalendarDaysIcon}
          enlace="/dashboard/cliente/reservas"
          textoEnlace="Ver reservas"
        >
          {proximasCitas.length === 0 ? (
            <EstadoVacio texto="Aún no tienes citas próximas. Cuando contactes con un profesional y generes una reserva, aparecerá aquí." />
          ) : (
            <div className="space-y-3">
              {proximasCitas.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{item.servicioTitulo}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.profesionalNombre}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatearFecha(item.fechaInicio || item.fechaCreacion)}</p>
                </div>
              ))}
            </div>
          )}
        </Seccion>

        <Seccion
          titulo="Mensajes recientes"
          descripcion="Retoma conversaciones abiertas y responde más rápido."
          icono={ChatBubbleLeftRightIcon}
          enlace="/dashboard/cliente/mensajes"
          textoEnlace="Abrir mensajes"
        >
          {mensajesRecientes.length === 0 ? (
            <EstadoVacio texto="Todavía no tienes conversaciones. Usa “Contactar” en un profesional para empezar." />
          ) : (
            <div className="space-y-3">
              {mensajesRecientes.map((item) => (
                <Link
                  key={item.id}
                  to={item.reservaId ? `/dashboard/cliente/mensajes/reserva/${item.reservaId}` : `/dashboard/cliente/mensajes/${item.id}`}
                  className="block rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">{item.profesionalNombre}</p>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {item.ultimoMensaje || "Aún no hay mensajes. Empieza la conversación 👇"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Seccion>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Seccion
          titulo="Pendientes de valorar"
          descripcion="Servicios completados que aún pueden recibir tu opinión."
          icono={StarIcon}
          enlace="/dashboard/cliente/reservas"
          textoEnlace="Ir a reservas"
        >
          {pendientesValorar.length === 0 ? (
            <EstadoVacio texto="No tienes servicios pendientes de valorar ahora mismo." />
          ) : (
            <div className="space-y-3">
              {pendientesValorar.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{item.servicioTitulo}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.profesionalNombre}</p>
                  <Link
                    to={`/dashboard/cliente/valorar/${item.id}`}
                    className="mt-3 inline-flex text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    Valorar ahora
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Seccion>

        <Seccion
          titulo="Profesionales recomendados"
          descripcion="Ideas para contratar sin salir de tu panel."
          icono={SparklesIcon}
          enlace="/dashboard/cliente/buscar/servicios"
          textoEnlace="Explorar servicios"
        >
          {recomendados.length === 0 ? (
            <EstadoVacio texto="Ahora mismo no pudimos cargar recomendaciones." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {recomendados.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to={`/dashboard/cliente/buscar/profesionales/${item.subcategoriaId}`}
                  className="rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <WrenchScrewdriverIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{item.titulo}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.nombreProfesional}</p>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">{item.descripcion}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Seccion>
      </div>
    </div>
  );
}

export default PanelCliente;
