import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisSolicitudes, confirmarReserva, rechazarReserva, completarReserva } from "api/reservas";
import {
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
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

function TarjetaSolicitud({ reserva, onActualizar }) {
  const navigate = useNavigate();
  const [accionando, setAccionando] = useState(false);

  const foto = reserva.clienteFotoUrl
    ? reserva.clienteFotoUrl.startsWith("http")
      ? reserva.clienteFotoUrl
      : API_URL + reserva.clienteFotoUrl
    : null;

  const iniciales = (reserva.clienteNombre ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  async function ejecutar(fn) {
    setAccionando(true);
    try {
      const actualizada = await fn(reserva.id);
      onActualizar(actualizada);
    } catch (err) {
      alert(err.message || "No se pudo realizar la acción.");
    } finally {
      setAccionando(false);
    }
  }

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
            <p className="text-sm font-semibold text-slate-900">{reserva.clienteNombre}</p>
            <p className="text-xs text-slate-500">{reserva.servicioTitulo}</p>
          </div>
        </div>
        <BadgeEstado estado={reserva.estado} />
      </div>

      {/* Descripción del cliente */}
      {reserva.descripcion ? (
        <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3">
          {reserva.descripcion}
        </p>
      ) : (
        <p className="text-xs text-slate-400 italic">El cliente no añadió descripción.</p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>
          Recibida el {new Date(reserva.fechaCreacion).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="font-semibold text-slate-700">{Number(reserva.precioTotal).toFixed(2)}€ est.</span>
      </div>

      {/* Acciones según estado */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {reserva.estado === "PENDIENTE" && (
          <>
            <button
              onClick={() => ejecutar(confirmarReserva)}
              disabled={accionando}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60">
              <CheckIcon className="h-3.5 w-3.5" />
              Aceptar
            </button>
            <button
              onClick={() => ejecutar(rechazarReserva)}
              disabled={accionando}
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition disabled:opacity-60">
              <XMarkIcon className="h-3.5 w-3.5" />
              Rechazar
            </button>
          </>
        )}

        {reserva.estado === "CONFIRMADA" && (
          <button
            onClick={() => ejecutar(completarReserva)}
            disabled={accionando}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60">
            Marcar como completado
          </button>
        )}

        {["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && (
          <button
            onClick={() => navigate(`/dashboard/profesional/mensajes/reserva/${reserva.id}`)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
            Chat
          </button>
        )}
      </div>
    </div>
  );
}

function MisSolicitudes() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filtro, setFiltro]     = useState("todas");

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar las solicitudes."))
      .finally(() => setLoading(false));
  }, []);

  function handleActualizar(reservaActualizada) {
    setReservas((prev) => prev.map((r) => r.id === reservaActualizada.id ? reservaActualizada : r));
  }

  const estados = ["todas", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

  const reservasFiltradas = filtro === "todas"
    ? reservas
    : reservas.filter((r) => r.estado === filtro);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando solicitudes…
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;
  }

  const pendientesCount = reservas.filter((r) => r.estado === "PENDIENTE").length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mis solicitudes</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona las peticiones de tus clientes.</p>
        </div>
        {pendientesCount > 0 && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {pendientesCount} pendiente{pendientesCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Tabs */}
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
          <ClipboardDocumentListIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">
            No tienes solicitudes {filtro !== "todas" ? `con estado "${ESTADO_CONFIG[filtro]?.label}"` : "todavía"}
          </p>
          <p className="mt-1 text-xs text-slate-400">Aquí aparecerán las peticiones de tus clientes.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {reservasFiltradas.map((r) => (
            <TarjetaSolicitud key={r.id} reserva={r} onActualizar={handleActualizar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisSolicitudes;
