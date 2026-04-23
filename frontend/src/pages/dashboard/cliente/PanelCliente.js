import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { obtenerMisReservas } from "api/reservas";
import { useAuth } from "context/AuthContext";

function formatFecha(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TarjetaReservaAceptada({ reserva }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <WrenchScrewdriverIcon className="h-5 w-5 text-emerald-600" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{reserva.servicioTitulo}</p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
              <UserCircleIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{reserva.profesionalNombre}</span>
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircleSolid className="h-3.5 w-3.5" />
          Aceptado
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <CalendarDaysIcon className="h-4 w-4 shrink-0 text-slate-400" />
        <span>{formatFecha(reserva.fechaInicio)}</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <ClockIcon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="font-semibold text-slate-800">{Number(reserva.precioTotal).toFixed(2)} €</span>
        <span className="text-xs text-slate-400">precio estimado</span>
      </div>
    </article>
  );
}

function TarjetaReservaPendiente({ reserva }) {
  return (
    <article className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{reserva.servicioTitulo}</p>
          <p className="text-xs text-slate-400 mt-0.5">{reserva.profesionalNombre}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Pendiente
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
        <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0" />
        {formatFecha(reserva.fechaInicio)}
      </p>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 h-28" />
      ))}
    </div>
  );
}

function PanelCliente() {
  const { usuario } = useAuth();
  const [reservas, setReservas]   = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    obtenerMisReservas()
      .then(setReservas)
      .catch(() => setReservas([]))
      .finally(() => setCargando(false));
  }, []);

  const aceptadas  = reservas.filter((r) => r.estado === "CONFIRMADA");
  const pendientes = reservas.filter((r) => r.estado === "PENDIENTE");

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Bienvenida */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {usuario?.nombre ?? "cliente"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Aquí tienes el resumen de tus servicios contratados.
        </p>
      </div>

      {/* Servicios aceptados */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-semibold text-slate-800">Servicios aceptados</h2>
          {aceptadas.length > 0 && (
            <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {aceptadas.length}
            </span>
          )}
        </div>

        {cargando ? (
          <Skeleton />
        ) : aceptadas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
            <CalendarDaysIcon className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">Ningún servicio aceptado aún</p>
            <p className="text-xs text-slate-400 mt-1">
              Cuando un profesional acepte tu solicitud, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {aceptadas.map((r) => (
              <TarjetaReservaAceptada key={r.id} reserva={r} />
            ))}
          </div>
        )}
      </section>

      {/* Solicitudes pendientes */}
      {(cargando || pendientes.length > 0) && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-800">Solicitudes pendientes</h2>
            {pendientes.length > 0 && (
              <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                {pendientes.length}
              </span>
            )}
          </div>

          {cargando ? (
            <Skeleton />
          ) : (
            <div className="space-y-2">
              {pendientes.map((r) => (
                <TarjetaReservaPendiente key={r.id} reserva={r} />
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}

export default PanelCliente;
