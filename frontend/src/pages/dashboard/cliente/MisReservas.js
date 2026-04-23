import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisReservas, cancelarReserva } from "api/reservas";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import API_URL from "api/config";

const ESTADO_CONFIG = {
  PENDIENTE:  { label: "Pendiente",  color: "bg-amber-100 text-amber-700 ring-amber-200" },
  CONFIRMADA: { label: "Aceptada",   color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  COMPLETADA: { label: "Completada", color: "bg-slate-100 text-slate-600 ring-slate-200" },
  CANCELADA:  { label: "Cancelada",  color: "bg-red-100 text-red-600 ring-red-200" },
};

function BadgeEstado({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, color: "bg-slate-100 text-slate-600 ring-slate-200" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function TarjetaReserva({ reserva, onCancelar }) {
  const navigate = useNavigate();
  const foto = reserva.profesionalFotoUrl
    ? reserva.profesionalFotoUrl.startsWith("http")
      ? reserva.profesionalFotoUrl
      : API_URL + reserva.profesionalFotoUrl
    : null;

  const iniciales = (reserva.profesionalNombre ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const puedeChat    = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);
  const puedeCancelar = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {foto ? (
            <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
              {iniciales}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{reserva.profesionalNombre}</p>
            <p className="text-xs text-slate-500">{reserva.servicioTitulo}</p>
          </div>
        </div>
        <BadgeEstado estado={reserva.estado} />
      </div>

      {/* Descripción */}
      {reserva.descripcion && (
        <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3">
          {reserva.descripcion}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CalendarDaysIcon className="h-3.5 w-3.5" />
          Solicitado el {new Date(reserva.fechaCreacion).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="font-semibold text-slate-700">{Number(reserva.precioTotal).toFixed(2)}€</span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-1">
        {puedeChat && (
          <button
            onClick={() => navigate(`/dashboard/cliente/mensajes/reserva/${reserva.id}`)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
            Chat
          </button>
        )}
        {puedeCancelar && (
          <button
            onClick={() => onCancelar(reserva)}
            className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition">
            <XCircleIcon className="h-3.5 w-3.5" />
            Cancelar
          </button>
        )}
        {reserva.estado === "COMPLETADA" && (
          <button
            onClick={() => navigate(`/dashboard/cliente/valorar/${reserva.id}`)}
            className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 transition">
            ⭐ Valorar
          </button>
        )}
      </div>
    </div>
  );
}

function ModalConfirmarCancelar({ reserva, onConfirmar, onCancelar, cargando }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-slate-900">¿Cancelar esta reserva?</h3>
        <p className="mt-1 text-sm text-slate-500">
          Vas a cancelar la reserva de <strong>{reserva.servicioTitulo}</strong> con {reserva.profesionalNombre}. Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            Volver
          </button>
          <button onClick={onConfirmar} disabled={cargando}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60">
            {cargando ? "Cancelando…" : "Sí, cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MisReservas() {
  const [reservas, setReservas]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filtro, setFiltro]         = useState("todas");
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    obtenerMisReservas()
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar tus reservas."))
      .finally(() => setLoading(false));
  }, []);

  const estados = ["todas", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

  const reservasFiltradas = filtro === "todas"
    ? reservas
    : reservas.filter((r) => r.estado === filtro);

  async function handleCancelar() {
    if (!reservaACancelar) return;
    setCancelando(true);
    try {
      const actualizada = await cancelarReserva(reservaACancelar.id);
      setReservas((prev) => prev.map((r) => r.id === actualizada.id ? actualizada : r));
      setReservaACancelar(null);
    } catch (err) {
      alert(err.message || "No se pudo cancelar la reserva.");
    } finally {
      setCancelando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando reservas…
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Mis reservas</h1>
        <p className="mt-1 text-sm text-slate-500">Seguimiento de todos tus servicios contratados.</p>
      </div>

      {/* Tabs de filtro */}
      <div className="mb-5 flex flex-wrap gap-2">
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filtro === e
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {e === "todas" ? "Todas" : ESTADO_CONFIG[e]?.label ?? e}
            {e === "todas"
              ? ` (${reservas.length})`
              : ` (${reservas.filter((r) => r.estado === e).length})`}
          </button>
        ))}
      </div>

      {reservasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <CalendarDaysIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">No tienes reservas {filtro !== "todas" ? `con estado "${ESTADO_CONFIG[filtro]?.label}"` : "todavía"}</p>
          <p className="mt-1 text-xs text-slate-400">Cuando contrates un profesional, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {reservasFiltradas.map((r) => (
            <TarjetaReserva key={r.id} reserva={r} onCancelar={setReservaACancelar} />
          ))}
        </div>
      )}

      {reservaACancelar && (
        <ModalConfirmarCancelar
          reserva={reservaACancelar}
          onConfirmar={handleCancelar}
          onCancelar={() => setReservaACancelar(null)}
          cargando={cancelando}
        />
      )}
    </div>
  );
}

export default MisReservas;
