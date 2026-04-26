import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { obtenerServiciosPorSubcategoria } from "api/servicios";
import { obtenerSubcategoriaPorId } from "api/subcategorias";
import { obtenerProfesionalesCercanos } from "api/profesional";
import { crearOObtenerConversacionContacto } from "api/conversaciones";
import { enviarMensaje } from "api/mensajes";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MapPinIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useLanguage } from "context/LanguageContext";
import { useAuth } from "context/AuthContext";
import { useGeolocalizacion } from "hooks/useGeolocalizacion";
import { anadirFavorito, eliminarFavorito, obtenerMisFavoritos } from "api/favoritos";
import { t } from "i18n";
import API_URL from "api/config";
import "leaflet/dist/leaflet.css";
import { Circle, CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";

const ITEMS_POR_PAGINA = 8;
const MAPA_ESPANA_CENTRO = [40.4168, -3.7038];
const MAPA_ESPANA_ZOOM = 6;
// Pasos discretos del slider: null = Toda España (sin filtro de distancia)
const PASOS_DISTANCIA = [3, 5, 10, 20, 30, 50, 100, 200, null];

function generarClientMessageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizar(str) {
  return (str || "").normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();
}

async function buscarUbicacionEnEspana(texto) {
  const query = texto.trim();
  if (!query) {
    throw new Error("Escribe una dirección o código postal.");
  }

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    countrycodes: "es",
    addressdetails: "1",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo buscar esa ubicación.");
  }

  const resultados = await res.json();
  if (!Array.isArray(resultados) || resultados.length === 0) {
    throw new Error("No encontramos esa ubicación.");
  }

  const primerResultado = resultados[0];
  return {
    latitud: Number(primerResultado.lat),
    longitud: Number(primerResultado.lon),
    etiqueta: primerResultado.display_name,
  };
}

async function buscarSugerenciasUbicacionEnEspana(texto) {
  const query = texto.trim();
  if (query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "6",
    countrycodes: "es",
    addressdetails: "1",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar sugerencias.");
  }

  const resultados = await res.json();
  if (!Array.isArray(resultados)) return [];

  const sugerencias = resultados.map((item, index) => {
    const address = item.address || {};
    const principal =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      item.name ||
      item.display_name;
    const secundaria = [
      address.state_district,
      address.state,
      address.province,
    ]
      .filter(Boolean)
      .filter((valor, idx, arr) => arr.findIndex((v) => v.toLowerCase() === valor.toLowerCase()) === idx)
      .join(", ");

    return {
      id: `${item.place_id || index}-${item.lat}-${item.lon}`,
      texto: item.display_name,
      principal,
      secundaria,
      latitud: Number(item.lat),
      longitud: Number(item.lon),
    };
  });

  return sugerencias.filter((sugerencia, index, arr) => {
    const etiqueta = `${sugerencia.principal}|${sugerencia.secundaria}`.toLowerCase();
    return arr.findIndex((item) => `${item.principal}|${item.secundaria}`.toLowerCase() === etiqueta) === index;
  });
}

async function obtenerDireccionDesdeCoordenadas(latitud, longitud) {
  const params = new URLSearchParams({
    lat: String(latitud),
    lon: String(longitud),
    format: "jsonv2",
    zoom: "18",
    addressdetails: "1",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener la dirección de tu ubicación.");
  }

  const data = await res.json();
  return data.display_name || "Ubicación actual detectada";
}

function RecentrarMapa({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);

  return null;
}

function AjustarVistaMapa({ center, distanciaKm }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    if (!distanciaKm || distanciaKm <= 0) {
      map.flyTo(center, 9, { animate: true, duration: 0.4 });
      return;
    }

    const latDelta = distanciaKm / 111;
    const lngDelta = distanciaKm / (111 * Math.max(Math.cos((center[0] * Math.PI) / 180), 0.2));
    map.fitBounds(
      [
        [center[0] - latDelta, center[1] - lngDelta],
        [center[0] + latDelta, center[1] + lngDelta],
      ],
      { animate: true, padding: [28, 28], duration: 0.4 }
    );
  }, [map, center, distanciaKm]);

  return null;
}

// ── Estrellas ─────────────────────────────────────────────────
function Estrellas({ valor, max = 5 }) {
  const redondeado = Math.round((valor ?? 0) * 2) / 2;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <StarSolid
          key={i}
          className={`h-3.5 w-3.5 ${i < redondeado ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.28)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-100" />
        </div>
        <div className="h-4 w-10 rounded bg-slate-200" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-16 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-7 w-20 rounded-full bg-slate-100" />
          <div className="h-7 w-20 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta de profesional ────────────────────────────────────
function TarjetaProfesional({ servicio, onContratar, onToggleFavorito, esFavorito, puedeFavorito, onVerPerfil }) {
  const { idioma } = useLanguage();

  const foto = servicio.fotoUrlProfesional
    ? servicio.fotoUrlProfesional.startsWith("http")
      ? servicio.fotoUrlProfesional
      : API_URL + servicio.fotoUrlProfesional
    : null;

  const iniciales = (servicio.nombreProfesional ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const duracionFormateada =
    servicio.duracionMin >= 60
      ? `${Math.floor(servicio.duracionMin / 60)}h${servicio.duracionMin % 60 > 0 ? ` ${servicio.duracionMin % 60}min` : ""}`
      : `${servicio.duracionMin} min`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.34)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 opacity-80" />
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
        {foto ? (
          <img
            src={foto}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white shadow"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white shadow">
            {iniciales}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {servicio.nombreProfesional}
          </p>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            {servicio.ciudadProfesional || "Zona no indicada"}
          </span>
        </div>

        <div className="flex flex-col items-end gap-0.5 shrink-0">
          {puedeFavorito && (
            <button
              type="button"
              onClick={() => onToggleFavorito(servicio)}
              className={`mb-1 rounded-full border p-2 transition ${
                esFavorito
                  ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-rose-500"
              }`}
              aria-label={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              {esFavorito ? <HeartSolid className="h-4 w-4" /> : <HeartIcon className="h-4 w-4" />}
            </button>
          )}
          {servicio.valoracionMedia ? (
            <>
              <span className="flex items-center gap-1 text-sm font-bold text-slate-800">
                <StarSolid className="h-3.5 w-3.5 text-amber-400" />
                {Number(servicio.valoracionMedia).toFixed(1)}
              </span>
              {servicio.numeroValoraciones > 0 && (
                <span className="text-xs text-slate-400">
                  {servicio.numeroValoraciones}{" "}
                  {t(idioma, "servicios.cards.opiniones")}
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
              Nuevo
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="mb-1.5 text-[15px] font-semibold leading-snug text-slate-900">
          {servicio.titulo}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {servicio.descripcion}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {duracionFormateada}
          </span>
          <Estrellas valor={servicio.valoracionMedia} />
        </div>

        {/* Precio + acciones */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">{t(idioma, "servicios.cards.desde")}</p>
            <p className="text-xl font-bold leading-none text-slate-900">
              {Number(servicio.precioHora).toFixed(0)}€
              <span className="text-xs font-normal text-slate-400">
                /{t(idioma, "servicios.cards.hora")}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onVerPerfil(servicio)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95">
              {t(idioma, "servicios.cards.verPerfil")}
            </button>
            <button
              onClick={() => onContratar(servicio)}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95">
              Contactar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Modal de contacto ─────────────────────────────────────
function ModalContratacion({ servicio, onClose, onExito }) {
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const contenido = descripcion.trim();
    if (!contenido) {
      setError("Escribe el primer mensaje para iniciar la conversación.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      const profesionalUsuarioId = servicio.profesionalUsuarioId;
      if (!profesionalUsuarioId) {
        throw new Error("No se pudo identificar al profesional.");
      }
      const conversacion = await crearOObtenerConversacionContacto(profesionalUsuarioId);
      await enviarMensaje({
        contenido,
        destinatarioId: profesionalUsuarioId,
        conversacionId: conversacion.id,
        clientMessageId: generarClientMessageId(),
      });
      onExito(conversacion);
    } catch (err) {
      setError(err.message || "No se pudo iniciar la conversación.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-600">Nuevo contacto</p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900 leading-tight">{servicio.titulo}</h2>
            <p className="text-sm text-slate-500">{servicio.nombreProfesional}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Cuéntale qué necesitas
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe brevemente tu necesidad, cuándo lo necesitas, cualquier detalle relevante…"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              required
            />
            <p className="mt-1 text-right text-xs text-slate-400">{descripcion.length}/1000</p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Precio estimado</span>
              <span className="font-semibold text-slate-900">{Number(servicio.precioHora).toFixed(0)}€/hora</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">El precio final se acordará con el profesional.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="flex-1 rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60">
              {enviando ? "Abriendo chat…" : "Ir al chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sección colapsable del sidebar ───────────────────────────
function SeccionFiltro({ titulo, children, defaultOpen = false }) {
  const [abierto, setAbierto] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium text-slate-800"
      >
        <span>{titulo}</span>
        {abierto
          ? <ChevronUpIcon className="h-4 w-4 text-slate-400" />
          : <ChevronDownIcon className="h-4 w-4 text-slate-400" />}
      </button>
      {abierto && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ── Chip de filtro activo ─────────────────────────────────────
function ChipFiltro({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition hover:bg-slate-200"
        aria-label={`Eliminar filtro ${label}`}
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </span>
  );
}

function FilaFiltro({ titulo, valor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-slate-200 py-3 text-left last:border-b-0"
    >
      <span className="text-sm font-medium text-slate-800">{titulo}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm text-slate-500">{valor}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-400" />
      </span>
    </button>
  );
}

function MapaBusqueda({ posicion, distanciaKm, cargandoUbicacion, onSolicitarUbicacion }) {
  const hayPosicion = Boolean(posicion);
  const center = hayPosicion
    ? [posicion.latitud, posicion.longitud]
    : MAPA_ESPANA_CENTRO;
  const zoom = hayPosicion ? 9 : MAPA_ESPANA_ZOOM;
  // El círculo crece/decrece con la barra; cuando no hay km (Toda España) desaparece
  const radioMetros = distanciaKm != null && distanciaKm > 0 ? distanciaKm * 1000 : 0;

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-[176px] w-full sm:h-[190px]" zoomControl={false}>
        <RecentrarMapa center={center} zoom={zoom} />
        <AjustarVistaMapa center={center} distanciaKm={distanciaKm} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {radioMetros > 0 && (
          <Circle
            key={radioMetros}
            center={center}
            radius={radioMetros}
            pathOptions={{ color: "#1f9d68", fillColor: "#4ade80", fillOpacity: 0.18, weight: 2 }}
          />
        )}
        <CircleMarker
          center={center}
          radius={hayPosicion ? 9 : 7}
          pathOptions={{ color: "#0f5132", fillColor: "#22c55e", fillOpacity: 1, weight: 3 }}
        />
      </MapContainer>
      <button
        onClick={onSolicitarUbicacion}
        className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)] ring-1 ring-slate-200 transition hover:bg-slate-50"
      >
        {cargandoUbicacion ? (
          <ArrowPathIcon className="h-5 w-5 animate-spin text-emerald-700" />
        ) : (
          <MapPinIcon className="h-5 w-5 text-slate-800" />
        )}
        Estoy aquí
      </button>
    </div>
  );
}

function ModalUbicacion({
  abierto,
  onClose,
  tabUbicacion,
  setTabUbicacion,
  zonaTemporal,
  setZonaTemporal,
  sugerenciasZona,
  cargandoSugerenciasZona,
  errorSugerenciasZona,
  seleccionarSugerenciaZona,
  limpiarZonaTemporal,
  distanciaTemporal,
  setDistanciaTemporal,
  posicion,
  textoUbicacionTemporal,
  setTextoUbicacionTemporal,
  cargandoDistancia,
  buscandoUbicacion,
  errorDistancia,
  errorBusquedaUbicacion,
  limpiarTextoUbicacion,
  buscarUbicacionManual,
  solicitarUbicacion,
  aplicarUbicacion,
  limpiarUbicacion,
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 px-4 py-4 backdrop-blur-sm sm:py-6">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white p-4 shadow-2xl sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">¿Dónde buscas?</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setTabUbicacion("cerca")}
            className={`rounded-2xl px-4 py-2.5 text-[15px] transition ${
              tabUbicacion === "cerca" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-700"
            }`}
          >
            Cerca de mí
          </button>
          <button
            onClick={() => setTabUbicacion("ciudad")}
            className={`rounded-2xl px-4 py-2.5 text-[15px] transition ${
              tabUbicacion === "ciudad" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"
            }`}
          >
            Provincia / Ciudad
          </button>
        </div>

        {tabUbicacion === "cerca" ? (
          <div className="space-y-2.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                buscarUbicacionManual();
              }}
              className="rounded-full border border-slate-300 px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="shrink-0 text-slate-500 transition hover:text-emerald-700"
                  aria-label="Buscar ubicación"
                >
                  {buscandoUbicacion ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin text-emerald-700" />
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="text"
                  value={textoUbicacionTemporal}
                  onChange={(e) => setTextoUbicacionTemporal(e.target.value)}
                  placeholder="Escribe una dirección o C.P."
                  className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none"
                />
                {textoUbicacionTemporal && (
                  <button
                    type="button"
                    onClick={limpiarTextoUbicacion}
                    className="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Limpiar ubicación"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            <MapaBusqueda
              posicion={posicion}
              distanciaKm={PASOS_DISTANCIA[distanciaTemporal]}
              cargandoUbicacion={cargandoDistancia}
              onSolicitarUbicacion={solicitarUbicacion}
            />

            {(() => {
              const kmActual = PASOS_DISTANCIA[distanciaTemporal];
              const etiqueta = kmActual === null ? "Toda España" : `${kmActual} km`;
              const pct = distanciaTemporal / (PASOS_DISTANCIA.length - 1); // 0..1
              return (
                <div className="px-1 pt-7">
                  <div className="relative mb-1 h-6">
                    <span
                      className="pointer-events-none absolute top-0 whitespace-nowrap text-[18px] font-semibold text-slate-900"
                      style={{
                        left: `${pct * 100}%`,
                        transform: `translateX(-${pct * 100}%)`,
                      }}
                    >
                      {etiqueta}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={PASOS_DISTANCIA.length - 1}
                    step={1}
                    value={distanciaTemporal}
                    onChange={(e) => setDistanciaTemporal(Number(e.target.value))}
                    className="slider-distancia"
                  />
                  <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                    <span>3 km</span>
                    <span>Toda España</span>
                  </div>
                </div>
              );
            })()}

            {(errorBusquedaUbicacion || errorDistancia) && (
              <p className="text-sm text-red-600">{errorBusquedaUbicacion || errorDistancia}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-full border border-slate-300 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-emerald-700" />
                <input
                  type="text"
                  value={zonaTemporal}
                  onChange={(e) => setZonaTemporal(e.target.value)}
                  placeholder="Provincia o ciudad"
                  className="w-full border-0 bg-transparent text-[15px] text-slate-800 outline-none"
                />
                {zonaTemporal && (
                  <button
                    type="button"
                    onClick={limpiarZonaTemporal}
                    className="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Limpiar provincia o ciudad"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-[220px]">
              {cargandoSugerenciasZona && (
                <div className="flex items-center gap-3 px-2 py-2 text-sm text-slate-500">
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-emerald-700" />
                  Buscando sugerencias...
                </div>
              )}

              {!cargandoSugerenciasZona && errorSugerenciasZona && (
                <p className="px-2 py-2 text-sm text-red-600">{errorSugerenciasZona}</p>
              )}

              {!cargandoSugerenciasZona && !errorSugerenciasZona && sugerenciasZona.length > 0 && (
                <div className="space-y-1">
                  {sugerenciasZona.map((sugerencia) => (
                    <button
                      key={sugerencia.id}
                      type="button"
                      onClick={() => seleccionarSugerenciaZona(sugerencia)}
                      className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50"
                    >
                      <MagnifyingGlassIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      <span className="min-w-0 text-[15px] text-slate-700">
                        <span className="font-semibold text-slate-900">{sugerencia.principal}</span>
                        {sugerencia.secundaria ? `, ${sugerencia.secundaria}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!cargandoSugerenciasZona && zonaTemporal.trim().length > 0 && zonaTemporal.trim().length < 3 && (
                <p className="px-2 py-2 text-sm text-slate-400">Escribe al menos 3 letras para ver sugerencias.</p>
              )}

              {!cargandoSugerenciasZona && !errorSugerenciasZona && zonaTemporal.trim().length >= 3 && sugerenciasZona.length === 0 && (
                <p className="px-2 py-2 text-sm text-slate-500">No encontramos ubicaciones con ese nombre.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={limpiarUbicacion}
            className="rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Limpiar
          </button>
          <button
            onClick={aplicarUbicacion}
            className="flex-1 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Aplicar ubicación
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Panel de filtros ──────────────────────────────────────────
function PanelFiltros({
  resumenUbicacion,
  abrirUbicacion,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  valoracionMin,
  setValoracionMin,
  hayFiltros,
  limpiarFiltros,
}) {
  return (
    <div>
      <FilaFiltro titulo="Ubicación" valor={resumenUbicacion} onClick={abrirUbicacion} />

      <SeccionFiltro titulo="Precio por hora (€)">
        {(() => {
          const errorPrecio =
            precioMin !== "" && precioMax !== "" && Number(precioMin) > Number(precioMax);
          const cls = (hasError) =>
            `w-full rounded-md border px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 ${
              hasError ? "border-red-400 bg-red-50" : "border-slate-300"
            }`;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Mín"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className={cls(errorPrecio)}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Máx"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className={cls(errorPrecio)}
                />
              </div>
              {errorPrecio && (
                <p className="text-xs text-red-500">El mínimo no puede superar el máximo.</p>
              )}
            </div>
          );
        })()}
      </SeccionFiltro>

      <SeccionFiltro titulo="Valoración mínima">
        <div className="space-y-2">
          <select
            value={valoracionMin}
            onChange={(e) => setValoracionMin(Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            {[
              { valor: 0,   label: "Cualquier valoración", estrellas: 0 },
              { valor: 3,   label: "3 o más",              estrellas: 3 },
              { valor: 4,   label: "4 o más",              estrellas: 4 },
              { valor: 4.5, label: "4,5 o más",            estrellas: 5 },
            ].map((op) => (
              <option key={op.valor} value={op.valor}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
      </SeccionFiltro>

    </div>
  );
}

// ── Paginación ────────────────────────────────────────────────
function Paginacion({ pagina, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null;

  const rango = Array.from({ length: totalPaginas }, (_, i) => i).filter(
    (i) => Math.abs(i - pagina) <= 2
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Paginación">
      <button
        onClick={() => onChange(pagina - 1)}
        disabled={pagina === 0}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      {rango[0] > 0 && (
        <>
          <button onClick={() => onChange(0)} className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50">1</button>
          {rango[0] > 1 && <span className="px-1 text-slate-300">…</span>}
        </>
      )}

      {rango.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
            i === pagina
              ? "bg-slate-900 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {rango[rango.length - 1] < totalPaginas - 1 && (
        <>
          {rango[rango.length - 1] < totalPaginas - 2 && <span className="px-1 text-slate-300">…</span>}
          <button onClick={() => onChange(totalPaginas - 1)} className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50">{totalPaginas}</button>
        </>
      )}

      <button
        onClick={() => onChange(pagina + 1)}
        disabled={pagina >= totalPaginas - 1}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
}

// ── Página principal ──────────────────────────────────────────
function Profesionales() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
  const { posicion, cargando: cargandoGeo, error: errorGeo, obtenerPosicion } = useGeolocalizacion();

  const [subcategoria, setSubcategoria]         = useState(null);
  const [servicios, setServicios]               = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [pagina, setPagina]                     = useState(0);
  const [drawerAbierto, setDrawerAbierto]       = useState(false);
  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [tabUbicacion, setTabUbicacion] = useState("cerca");

  // Filtros
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [precioMin, setPrecioMin]               = useState("");
  const [precioMax, setPrecioMax]               = useState("");
  const [valoracionMin, setValoracionMin]       = useState(0);
  const [distanciaMax, setDistanciaMax]         = useState(0);
  const [zonaTemporal, setZonaTemporal]         = useState("");
  const [zonaTemporalValida, setZonaTemporalValida] = useState("");
  const [sugerenciasZona, setSugerenciasZona] = useState([]);
  const [cargandoSugerenciasZona, setCargandoSugerenciasZona] = useState(false);
  const [errorSugerenciasZona, setErrorSugerenciasZona] = useState("");
  const [distanciaTemporal, setDistanciaTemporal] = useState(PASOS_DISTANCIA.length - 1); // índice en PASOS_DISTANCIA
  const [coordenadasBusqueda, setCoordenadasBusqueda] = useState(null);
  const [coordenadasBusquedaTemporal, setCoordenadasBusquedaTemporal] = useState(null);
  const [textoUbicacionTemporal, setTextoUbicacionTemporal] = useState("");
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorBusquedaUbicacion, setErrorBusquedaUbicacion] = useState("");
  const [profesionalesCercanos, setProfesionalesCercanos] = useState(null);
  const [cargandoDistancia, setCargandoDistancia] = useState(false);
  const [errorDistancia, setErrorDistancia] = useState("");

  // Contacto
  const [servicioAContratar, setServicioAContratar] = useState(null);
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const esCliente = usuario?.rol?.toUpperCase() === "CLIENTE";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      obtenerServiciosPorSubcategoria(id, 0, 100),
      obtenerSubcategoriaPorId(id),
    ])
      .then(([data, sub]) => {
        setServicios(data.content || []);
        setSubcategoria(sub);
      })
      .catch(() => {
        setServicios([]);
        setSubcategoria(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!esCliente) {
      setFavoritosIds(new Set());
      return;
    }

    obtenerMisFavoritos()
      .then((data) => setFavoritosIds(new Set(data.map((item) => item.servicio.id))))
      .catch(() => setFavoritosIds(new Set()));
  }, [esCliente, usuario]);

  useEffect(() => {
    const pending = location.state?.pendingAction;
    if (!usuario || !pending || pending.tipo !== "contactar") return;
    if (!Array.isArray(servicios) || servicios.length === 0) return;

    const servicioPendiente = servicios.find((servicio) => Number(servicio.id) === Number(pending.servicioId));
    if (!servicioPendiente) return;

    setServicioAContratar(servicioPendiente);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate, servicios, usuario]);

  // Resetear página cuando cambia cualquier filtro
  useEffect(() => { setPagina(0); }, [zonaSeleccionada, precioMin, precioMax, valoracionMin, distanciaMax, id]);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerAbierto || modalUbicacionAbierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerAbierto, modalUbicacionAbierto]);

  useEffect(() => {
    let cancelado = false;

    async function cargarCercanos() {
      if (distanciaMax <= 0) {
        setProfesionalesCercanos(null);
        setErrorDistancia("");
        return;
      }

      setCargandoDistancia(true);
      setErrorDistancia("");

      try {
        const coords = coordenadasBusqueda ?? posicion ?? await obtenerPosicion();
        if (cancelado) return;

        const cercanos = await obtenerProfesionalesCercanos(
          coords.latitud,
          coords.longitud,
          distanciaMax
        );

        if (cancelado) return;
        setProfesionalesCercanos(new Set(cercanos.map((p) => p.id)));
      } catch (error) {
        if (cancelado) return;
        setProfesionalesCercanos(new Set());
        setErrorDistancia(error.message || "No se pudo aplicar el filtro por distancia.");
      } finally {
        if (!cancelado) setCargandoDistancia(false);
      }
    }

    cargarCercanos();
    return () => { cancelado = true; };
  }, [distanciaMax, coordenadasBusqueda, posicion, obtenerPosicion]);

  useEffect(() => {
    if (!modalUbicacionAbierto || tabUbicacion !== "ciudad") return;

    const texto = zonaTemporal.trim();
    if (texto.length < 3) {
      setSugerenciasZona([]);
      setErrorSugerenciasZona("");
      setCargandoSugerenciasZona(false);
      return;
    }

    let cancelado = false;
    setCargandoSugerenciasZona(true);
    setErrorSugerenciasZona("");

    const timer = setTimeout(async () => {
      try {
        const resultados = await buscarSugerenciasUbicacionEnEspana(texto);
        if (cancelado) return;
        setSugerenciasZona(resultados);
      } catch (error) {
        if (cancelado) return;
        setSugerenciasZona([]);
        setErrorSugerenciasZona(error.message || "No se pudieron cargar sugerencias.");
      } finally {
        if (!cancelado) setCargandoSugerenciasZona(false);
      }
    }, 250);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [zonaTemporal, tabUbicacion, modalUbicacionAbierto]);

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((s) => {
      const precio = Number(s.precioHora) || 0;
      const zonaServicio = normalizar(s.ciudadProfesional);
      const zonaBuscada = normalizar(zonaSeleccionada);
      if (zonaBuscada && !zonaServicio.includes(zonaBuscada)) return false;
      const pMin = precioMin !== "" ? Number(precioMin) : null;
      const pMax = precioMax !== "" ? Number(precioMax) : null;
      if (pMin !== null && pMax !== null && pMin > pMax) { /* rango inválido: ignorar filtro precio */ }
      else {
        if (pMin !== null && precio < pMin) return false;
        if (pMax !== null && precio > pMax) return false;
      }
      if (valoracionMin > 0 && (s.valoracionMedia || 0) < valoracionMin) return false;
      if (distanciaMax > 0 && profesionalesCercanos && !profesionalesCercanos.has(s.profesionalId)) return false;
      return true;
    });
  }, [servicios, zonaSeleccionada, precioMin, precioMax, valoracionMin, distanciaMax, profesionalesCercanos]);

  const totalPaginas   = Math.max(1, Math.ceil(serviciosFiltrados.length / ITEMS_POR_PAGINA));
  const paginaSegura   = Math.min(pagina, totalPaginas - 1);
  const serviciosPaginados = serviciosFiltrados.slice(
    paginaSegura * ITEMS_POR_PAGINA,
    (paginaSegura + 1) * ITEMS_POR_PAGINA
  );

  const hayFiltros = zonaSeleccionada || precioMin !== "" || precioMax !== "" || valoracionMin > 0 || distanciaMax > 0;

  function limpiarFiltros() {
    setZonaSeleccionada("");
    setPrecioMin("");
    setPrecioMax("");
    setValoracionMin(0);
    setDistanciaMax(0);
    setZonaTemporal("");
    setDistanciaTemporal(PASOS_DISTANCIA.length - 1);
    setCoordenadasBusqueda(null);
    setCoordenadasBusquedaTemporal(null);
    setTextoUbicacionTemporal("");
    setZonaTemporalValida("");
    setSugerenciasZona([]);
    setCargandoSugerenciasZona(false);
    setErrorSugerenciasZona("");
    setBuscandoUbicacion(false);
    setErrorBusquedaUbicacion("");
    setProfesionalesCercanos(null);
    setErrorDistancia("");
  }

  function abrirUbicacion() {
    setZonaTemporal(zonaSeleccionada);
    setZonaTemporalValida(zonaSeleccionada);
    const idx = distanciaMax === 0
      ? PASOS_DISTANCIA.length - 1
      : Math.max(0, PASOS_DISTANCIA.indexOf(distanciaMax));
    setDistanciaTemporal(idx === -1 ? PASOS_DISTANCIA.length - 1 : idx);
    setCoordenadasBusquedaTemporal(coordenadasBusqueda);
    setTextoUbicacionTemporal(coordenadasBusqueda?.etiqueta || "");
    setErrorBusquedaUbicacion("");
    setErrorSugerenciasZona("");
    setTabUbicacion(zonaSeleccionada ? "ciudad" : "cerca");
    setModalUbicacionAbierto(true);
  }

  function aplicarUbicacion() {
    if (tabUbicacion === "cerca") {
      const kmSeleccionado = PASOS_DISTANCIA[distanciaTemporal];
      if (kmSeleccionado !== null && !coordenadasBusquedaTemporal) {
        setErrorBusquedaUbicacion("Introduce una dirección o pulsa «Estoy aquí» para buscar por distancia.");
        return;
      }
      setZonaSeleccionada("");
      if (kmSeleccionado === null) {
        setDistanciaMax(0);
        setCoordenadasBusqueda(null);
      } else {
        setDistanciaMax(kmSeleccionado);
        setCoordenadasBusqueda(coordenadasBusquedaTemporal);
      }
    } else {
      if (zonaTemporal.trim() && !zonaTemporalValida) {
        setErrorSugerenciasZona("Selecciona una provincia o ciudad válida de la lista.");
        return;
      }
      setDistanciaMax(0);
      setZonaSeleccionada(zonaTemporalValida || zonaTemporal.trim());
      setCoordenadasBusqueda(null);
    }
    setModalUbicacionAbierto(false);
  }

  function limpiarUbicacionModal() {
    setZonaTemporal("");
    setDistanciaTemporal(PASOS_DISTANCIA.length - 1);
    setCoordenadasBusquedaTemporal(null);
    setTextoUbicacionTemporal("");
    setZonaTemporalValida("");
    setSugerenciasZona([]);
    setCargandoSugerenciasZona(false);
    setErrorSugerenciasZona("");
    setBuscandoUbicacion(false);
    setErrorBusquedaUbicacion("");
  }

  async function buscarUbicacionManual() {
    try {
      setBuscandoUbicacion(true);
      setErrorBusquedaUbicacion("");
      const resultado = await buscarUbicacionEnEspana(textoUbicacionTemporal);
      setCoordenadasBusquedaTemporal(resultado);
      setTextoUbicacionTemporal(resultado.etiqueta);
    } catch (error) {
      setErrorBusquedaUbicacion(error.message || "No se pudo buscar esa ubicación.");
    } finally {
      setBuscandoUbicacion(false);
    }
  }

  async function usarUbicacionActual() {
    try {
      setBuscandoUbicacion(true);
      setErrorBusquedaUbicacion("");
      const coords = await obtenerPosicion();
      let etiqueta = "Ubicación actual detectada";

      try {
        etiqueta = await obtenerDireccionDesdeCoordenadas(coords.latitud, coords.longitud);
      } catch {
        etiqueta = "Ubicación actual detectada";
      }

      setCoordenadasBusquedaTemporal({
        ...coords,
        etiqueta,
      });
      setTextoUbicacionTemporal(etiqueta);
    } catch {
      // El hook ya expone el mensaje de error; aquí solo evitamos romper el flujo.
    } finally {
      setBuscandoUbicacion(false);
    }
  }

  function handleContratar(servicio) {
    if (!usuario) {
      sessionStorage.setItem("pendingAction", JSON.stringify({
        tipo: "contactar",
        servicioId: servicio.id,
        redirectTo: location.pathname,
      }));
      navigate("/login");
      return;
    }
    setServicioAContratar(servicio);
  }

  function handleVerPerfil(servicio) {
    navigate(`/perfil-profesional/${servicio.profesionalId}`);
  }

  async function handleToggleFavorito(servicio) {
    if (!usuario) {
      navigate("/login");
      return;
    }

    if (!esCliente) {
      alert("Solo los clientes pueden guardar servicios como favorito.");
      return;
    }

    const yaEraFavorito = favoritosIds.has(servicio.id);
    const siguiente = new Set(favoritosIds);

    if (yaEraFavorito) {
      siguiente.delete(servicio.id);
      setFavoritosIds(siguiente);
      try {
        await eliminarFavorito(servicio.id);
      } catch (error) {
        const revertido = new Set(siguiente);
        revertido.add(servicio.id);
        setFavoritosIds(revertido);
        alert(error.message || "No se pudo actualizar favoritos.");
      }
      return;
    }

    siguiente.add(servicio.id);
    setFavoritosIds(siguiente);
    try {
      await anadirFavorito(servicio.id);
    } catch (error) {
      const revertido = new Set(siguiente);
      revertido.delete(servicio.id);
      setFavoritosIds(revertido);
      alert(error.message || "No se pudo actualizar favoritos.");
    }
  }

  function manejarCambioZonaTemporal(valor) {
    setZonaTemporal(valor);
    setZonaTemporalValida("");
    setErrorSugerenciasZona("");
  }

  function seleccionarSugerenciaZona(sugerencia) {
    const etiqueta = sugerencia.secundaria
      ? `${sugerencia.principal}, ${sugerencia.secundaria}`
      : sugerencia.principal;
    setZonaTemporal(etiqueta);
    setZonaTemporalValida(sugerencia.principal);
    setSugerenciasZona([]);
    setErrorSugerenciasZona("");
  }

  // Chips de filtros activos
  const chips = [
    zonaSeleccionada && { key: "zona",     label: `Zona: ${zonaSeleccionada}`, remove: () => setZonaSeleccionada("") },
    precioMin !== "" && { key: "pmin",     label: `Desde ${precioMin}€`, remove: () => setPrecioMin("") },
    precioMax !== "" && { key: "pmax",     label: `Hasta ${precioMax}€`, remove: () => setPrecioMax("") },
    valoracionMin > 0 && { key: "val",    label: `${valoracionMin}+ ⭐`,  remove: () => setValoracionMin(0) },
    distanciaMax > 0 && { key: "dist",    label: `Hasta ${distanciaMax} km`, remove: () => setDistanciaMax(0) },
  ].filter(Boolean);

  const filtrosProps = {
    precioMin, setPrecioMin, precioMax, setPrecioMax,
    valoracionMin, setValoracionMin,
    resumenUbicacion: distanciaMax > 0
      ? `Hasta ${distanciaMax} km de mí`
      : zonaSeleccionada || "Toda España",
    abrirUbicacion,
    hayFiltros, limpiarFiltros,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.18),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4f8_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Servicios
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                {loading ? "Cargando..." : subcategoria?.nombre || "Profesionales disponibles"}
              </h1>
              {!loading && (
                <p className="mt-1 text-sm text-slate-500">
                  {serviciosFiltrados.length === servicios.length
                    ? `${servicios.length} profesional${servicios.length !== 1 ? "es" : ""} disponible${servicios.length !== 1 ? "s" : ""}`
                    : `${serviciosFiltrados.length} de ${servicios.length} profesionales`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Barra de herramientas ── */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {/* Botón filtros (solo móvil) */}
          <button
            onClick={() => setDrawerAbierto(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 lg:hidden"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filtros
            {chips.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {chips.length}
              </span>
            )}
          </button>

          {/* Chips de filtros activos */}
          {chips.map((c) => (
            <ChipFiltro key={c.key} label={c.label} onRemove={c.remove} />
          ))}

        </div>

        {/* ── Layout: sidebar + grid ── */}
        <div className="grid items-start gap-6 lg:grid-cols-[256px_minmax(0,1fr)]">

          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Filtros</h2>
                  <p className="mt-1 text-xs text-slate-500">Ajusta la búsqueda sin perder espacio.</p>
                </div>
                {hayFiltros && (
                  <button
                    onClick={limpiarFiltros}
                    className="text-xs font-medium text-slate-500 transition hover:text-slate-700 hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <PanelFiltros {...filtrosProps} />
            </div>
          </aside>

          {/* Área de resultados */}
          <section>
            {cargandoDistancia && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-700">
                <ArrowPathIcon className="h-4 w-4 shrink-0 animate-spin" />
                Buscando profesionales en la zona…
              </div>
            )}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : serviciosFiltrados.length === 0 ? (
              /* Estado vacío */
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/90 px-8 py-16 text-center shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <AdjustmentsHorizontalIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-base font-semibold text-slate-700">Sin resultados</p>
                <p className="mt-1 text-sm text-slate-400">
                  Prueba a modificar o eliminar algún filtro
                </p>
                {hayFiltros && (
                  <button
                    onClick={limpiarFiltros}
                    className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Ver todos los profesionales
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {serviciosPaginados.map((s) => (
                    <TarjetaProfesional
                      key={s.id}
                      servicio={s}
                      onContratar={handleContratar}
                      onVerPerfil={handleVerPerfil}
                      onToggleFavorito={handleToggleFavorito}
                      esFavorito={favoritosIds.has(s.id)}
                      puedeFavorito={!usuario || esCliente}
                    />
                  ))}
                </div>
                <Paginacion
                  pagina={paginaSegura}
                  totalPaginas={totalPaginas}
                  onChange={setPagina}
                />
              </>
            )}
          </section>
        </div>
      </div>

      {servicioAContratar && (
        <ModalContratacion
          servicio={servicioAContratar}
          onClose={() => setServicioAContratar(null)}
          onExito={(conversacion) => {
            setServicioAContratar(null);
            navigate(`/dashboard/cliente/mensajes/${conversacion.id}`);
          }}
        />
      )}

      <ModalUbicacion
        abierto={modalUbicacionAbierto}
        onClose={() => setModalUbicacionAbierto(false)}
        tabUbicacion={tabUbicacion}
        setTabUbicacion={setTabUbicacion}
        zonaTemporal={zonaTemporal}
        setZonaTemporal={manejarCambioZonaTemporal}
        sugerenciasZona={sugerenciasZona}
        cargandoSugerenciasZona={cargandoSugerenciasZona}
        errorSugerenciasZona={errorSugerenciasZona}
        seleccionarSugerenciaZona={seleccionarSugerenciaZona}
        limpiarZonaTemporal={() => {
          setZonaTemporal("");
          setZonaTemporalValida("");
          setSugerenciasZona([]);
          setErrorSugerenciasZona("");
        }}
        distanciaTemporal={distanciaTemporal}
        setDistanciaTemporal={setDistanciaTemporal}
        posicion={coordenadasBusquedaTemporal}
        textoUbicacionTemporal={textoUbicacionTemporal}
        setTextoUbicacionTemporal={setTextoUbicacionTemporal}
        cargandoDistancia={cargandoDistancia || cargandoGeo || buscandoUbicacion}
        buscandoUbicacion={buscandoUbicacion}
        errorDistancia={distanciaTemporal > 0 ? (errorDistancia || errorGeo || "") : ""}
        errorBusquedaUbicacion={errorBusquedaUbicacion}
        limpiarTextoUbicacion={() => {
          setTextoUbicacionTemporal("");
          setCoordenadasBusquedaTemporal(null);
          setErrorBusquedaUbicacion("");
        }}
        buscarUbicacionManual={buscarUbicacionManual}
        solicitarUbicacion={usarUbicacionActual}
        aplicarUbicacion={aplicarUbicacion}
        limpiarUbicacion={limpiarUbicacionModal}
      />

      {/* ── Drawer de filtros móvil ── */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDrawerAbierto(false)}
          />
          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Filtros</h2>
                <p className="mt-1 text-xs text-slate-500">Ajusta la búsqueda sin perder espacio.</p>
              </div>
              <button
                onClick={() => setDrawerAbierto(false)}
                className="rounded-full p-1.5 transition hover:bg-slate-100"
              >
                <XMarkIcon className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <PanelFiltros {...filtrosProps} />

            <button
              onClick={() => setDrawerAbierto(false)}
              className="mt-5 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              Ver {serviciosFiltrados.length} resultado{serviciosFiltrados.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profesionales;
