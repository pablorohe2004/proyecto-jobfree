import { useEffect, useState } from "react";
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { obtenerReservasRecibidas, confirmarReserva, denegarReserva } from "api/reservas";

const TABS = [
  { key: "PENDIENTE",  label: "Pendientes" },
  { key: "CONFIRMADA", label: "Aceptadas" },
  { key: "CANCELADA",  label: "Denegadas" },
];

function formatFecha(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BadgeEstado({ estado }) {
  const estilos = {
    PENDIENTE:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    CONFIRMADA: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    CANCELADA:  "bg-red-50 text-red-600 ring-1 ring-red-200",
    COMPLETADA: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  const etiquetas = {
    PENDIENTE: "Pendiente",
    CONFIRMADA: "Aceptada",
    CANCELADA: "Denegada",
    COMPLETADA: "Completada",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilos[estado] ?? ""}`}>
      {etiquetas[estado] ?? estado}
    </span>
  );
}

function TarjetaSolicitud({ reserva, onAceptar, onDenegar, procesando }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <UserCircleIcon className="h-6 w-6 text-slate-500" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{reserva.clienteNombre}</p>
            <p className="text-xs text-slate-400">Cliente</p>
          </div>
        </div>
        <BadgeEstado estado={reserva.estado} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <WrenchScrewdriverIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-medium">{reserva.servicioTitulo}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDaysIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{formatFecha(reserva.fechaInicio)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ClockIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-semibold text-slate-800">{Number(reserva.precioTotal).toFixed(2)} €</span>
          <span className="text-xs text-slate-400">precio estimado</span>
        </div>
      </div>

      {reserva.estado === "PENDIENTE" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAceptar(reserva.id)}
            disabled={procesando}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <CheckIcon className="h-4 w-4" />
            Aceptar
          </button>
          <button
            onClick={() => onDenegar(reserva.id)}
            disabled={procesando}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <XMarkIcon className="h-4 w-4" />
            Denegar
          </button>
        </div>
      )}

      {reserva.estado === "CONFIRMADA" && (
        <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
          <CheckCircleIcon className="h-4 w-4" />
          Solicitud aceptada
        </div>
      )}
    </article>
  );
}

function Solicitudes() {
  const [reservas, setReservas]       = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState("");
  const [tabActiva, setTabActiva]     = useState("PENDIENTE");
  const [procesando, setProcesando]   = useState(false);
  const [feedback, setFeedback]       = useState("");

  useEffect(() => {
    setCargando(true);
    obtenerReservasRecibidas()
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  async function handleAceptar(id) {
    setProcesando(true);
    setFeedback("");
    try {
      const actualizada = await confirmarReserva(id);
      setReservas((prev) =>
        prev.map((r) => (r.id === actualizada.id ? { ...r, ...actualizada } : r))
      );
      setFeedback("Solicitud aceptada correctamente.");
    } catch (e) {
      setFeedback(e.message);
    } finally {
      setProcesando(false);
    }
  }

  async function handleDenegar(id) {
    setProcesando(true);
    setFeedback("");
    try {
      const actualizada = await denegarReserva(id);
      setReservas((prev) =>
        prev.map((r) => (r.id === actualizada.id ? { ...r, ...actualizada } : r))
      );
      setFeedback("Solicitud denegada.");
    } catch (e) {
      setFeedback(e.message);
    } finally {
      setProcesando(false);
    }
  }

  const reservasFiltradas = reservas.filter((r) => r.estado === tabActiva);
  const contadorPendientes = reservas.filter((r) => r.estado === "PENDIENTE").length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Solicitudes recibidas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona las solicitudes de contratación de tus clientes.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabActiva(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tabActiva === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.key === "PENDIENTE" && contadorPendientes > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {contadorPendientes}
              </span>
            )}
          </button>
        ))}
      </div>

      {feedback && (
        <p className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
          feedback.includes("correctamente") || feedback.includes("aceptada")
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
        }`}>
          {feedback}
        </p>
      )}

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 h-36" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : reservasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <CalendarDaysIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">No hay solicitudes {TABS.find(t => t.key === tabActiva)?.label.toLowerCase()}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservasFiltradas.map((r) => (
            <TarjetaSolicitud
              key={r.id}
              reserva={r}
              onAceptar={handleAceptar}
              onDenegar={handleDenegar}
              procesando={procesando}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Solicitudes;
