import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";
import LanguageMenu from "components/layout/public/LanguageMenu";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { obtenerTodasSubcategorias } from "api/subcategorias";
import API_URL from "api/config";
import { obtenerMisNotificaciones, marcarNotificacionComoLeida } from "api/notificaciones";
import { obtenerConteoMensajesNoLeidos } from "api/mensajes";
import { obtenerMisReservas, obtenerMisSolicitudes } from "api/reservas";
import { useChatSocket } from "context/ChatSocketContext";

function formatearFechaNotificacion(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Topbar({ setOpen }) {

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const [query, setQuery] = useState("");
  const [todosServicios, setTodosServicios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const [pendientes, setPendientes] = useState(0);

  const menuRef = useRef();
  const bellRef = useRef();
  const buscadorRef = useRef();

  const navigate = useNavigate();
  const { idioma } = useLanguage();
  const { usuario, cerrarSesion } = useAuth();
  const { tema } = useTheme();
  const { subscribeToUserQueue } = useChatSocket();

  const esTemaOscuro = tema.texto === "#ffffff";
  const notificacionesNoLeidas = notificaciones.filter((item) => !item.leida).length;
  const totalAlertas = mensajesNoLeidos + pendientes;

  useEffect(() => {
    obtenerTodasSubcategorias()
      .then(setTodosServicios)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario?.id) {
      setNotificaciones([]);
      setMensajesNoLeidos(0);
      setPendientes(0);
      return undefined;
    }

    function cargarNotificaciones() {
      obtenerMisNotificaciones()
        .then(setNotificaciones)
        .catch(() => {});
    }

    function cargarMensajesNoLeidos() {
      obtenerConteoMensajesNoLeidos()
        .then((data) => setMensajesNoLeidos(Number(data?.total || 0)))
        .catch(() => {});
    }

    function cargarPendientes() {
      const esProfesional = usuario?.rol?.toUpperCase() === "PROFESIONAL";
      const request = esProfesional ? obtenerMisSolicitudes() : obtenerMisReservas();

      request
        .then((lista) => setPendientes(lista.filter((item) => item.estado === "PENDIENTE").length))
        .catch(() => setPendientes(0));
    }

    cargarNotificaciones();
    cargarMensajesNoLeidos();
    cargarPendientes();

    function handleReservasActualizadas() {
      cargarPendientes();
      cargarNotificaciones();
    }

    window.addEventListener("reservas:actualizadas", handleReservasActualizadas);

    const unsubscribe = subscribeToUserQueue((evento) => {
      if (
        evento?.tipo === "mensaje.nuevo"
        || evento?.tipo === "mensaje.leido"
        || evento?.tipo === "mensaje.leido.lote"
        || evento?.tipo === "mensaje.recibido"
        || evento?.tipo === "mensaje.recibido.lote"
        || evento?.tipo === "usuario.mensajes.actualizados"
        || evento?.tipo === "conversacion.actualizada"
      ) {
        cargarMensajesNoLeidos();
      }
    });

    return () => {
      window.removeEventListener("reservas:actualizadas", handleReservasActualizadas);
      unsubscribe();
    };
  }, [usuario?.id, usuario?.rol, subscribeToUserQueue]);

  function resolverImagenBusqueda(imagen) {
    if (!imagen) return null;
    if (imagen.startsWith("http")) return imagen;
    if (imagen.startsWith("/images/")) return imagen;
    return API_URL + imagen;
  }

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setQuery("");
        setResultados([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function obtenerBaseBusquedaDashboard() {
    const rol = usuario?.rol?.toLowerCase();
    if (rol === "cliente") return "/dashboard/cliente/buscar";
    if (rol === "profesional") return "/dashboard/profesional/buscar";
    return "";
  }

  function navegarASubcategoria(id) {
    const base = obtenerBaseBusquedaDashboard();
    navigate(base ? `${base}/servicios/subcategoria/${id}` : `/servicios/subcategoria/${id}`);
    setQuery("");
    setResultados([]);
  }

  function handleQuery(e) {
    const valor = e.target.value;
    setQuery(valor);
    if (!valor.trim()) { setResultados([]); return; }
    setResultados(
      todosServicios
        .filter(s => s.nombre.toLowerCase().includes(valor.toLowerCase().trim()))
        .slice(0, 6)
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const base = obtenerBaseBusquedaDashboard();
      navigate(base
        ? `${base}/servicios?q=${encodeURIComponent(query.trim())}`
        : `/servicios?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResultados([]);
    }
    if (e.key === "Escape") { setQuery(""); setResultados([]); }
  }

  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/");
  }

  async function handleMarcarNotificacion(notificacionId) {
    try {
      const actualizada = await marcarNotificacionComoLeida(notificacionId);
      setNotificaciones((prev) => prev.map((item) => (
        item.id === actualizada.id ? actualizada : item
      )));
    } catch {
      // No bloqueamos la UX por un fallo puntual.
    }
  }

  function obtenerRutaConfiguracion() {
    return usuario?.rol?.toUpperCase() === "PROFESIONAL"
      ? "/dashboard/profesional/configuracion"
      : "/dashboard/cliente/configuracion";
  }

  const clsIcono = esTemaOscuro ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-700";
  const clsBorde = esTemaOscuro ? "border-white/10" : "border-gray-200";

  return (
    <header
      style={{ backgroundColor: tema.bg, borderColor: tema.borde }}
      className="h-16 border-b flex items-center px-6 fixed top-0 right-0 left-0 md:left-64 z-30 transition-colors duration-300"
    >
      {/* Botón menú móvil */}
      <button onClick={() => setOpen(true)} className={`md:hidden mr-4 ${clsIcono}`}>
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Buscador */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-72 ml-2" ref={buscadorRef}>
          <input
            type="text"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            placeholder={t(idioma, "nav.buscar")}
            style={{
              color: tema.texto,
              backgroundColor: esTemaOscuro ? "rgba(255,255,255,0.1)" : "#f9fafb",
              borderColor: esTemaOscuro ? "rgba(255,255,255,0.2)" : "#e5e7eb",
            }}
            className="w-full rounded-full px-4 py-2 pr-10 border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-gray-500"
          />
          <MagnifyingGlassIcon className={`w-5 h-5 absolute right-3 top-2.5 ${clsIcono}`} />

          {query.trim().length > 0 && (
            <div className="absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden" style={{boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"}}>
              {resultados.length > 0 ? (
                resultados.map(s => (
                  <button
                    key={s.id}
                    onClick={() => navegarASubcategoria(s.id)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 border-b last:border-0 transition">
                    {s.imagen ? (
                      <img
                        src={resolverImagenBusqueda(s.imagen)}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                        <span className="text-emerald-600 text-base font-bold">{s.nombre?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.nombre}</p>
                      {s.categoriaNombre && (
                        <p className="text-xs text-gray-400 truncate">{s.categoriaNombre}</p>
                      )}
                      {s.descripcion && (
                        <p className="text-xs text-gray-500 truncate">{s.descripcion}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">
                  {t(idioma, "servicios.estado.sinResultados")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Zona derecha */}
      <div className="flex items-center gap-3 shrink-0">

        {/* ── Notificaciones ── */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => { setBellOpen(v => !v); setUserMenuOpen(false); }}
            className={`relative p-1.5 rounded-full transition ${clsIcono}`}>
            <BellIcon className="w-6 h-6" />
            {totalAlertas > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[1.1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {totalAlertas > 99 ? "99+" : totalAlertas}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden" style={{boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"}}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <span className="font-semibold text-gray-800 text-sm">Notificaciones</span>
                <span className="text-xs text-gray-400">{notificacionesNoLeidas} nuevas</span>
              </div>
              <div className="border-b border-gray-100 px-4 py-3 text-xs text-gray-500 space-y-1 bg-white">
                <p>Solicitudes pendientes: <span className="font-semibold text-gray-700">{pendientes}</span></p>
                <p>Mensajes sin leer: <span className="font-semibold text-gray-700">{mensajesNoLeidos}</span></p>
              </div>
              {notificaciones.length === 0 ? (
                <div className="py-10 text-center">
                  <BellIcon className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No tienes notificaciones</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notificaciones.slice(0, 8).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMarcarNotificacion(item.id)}
                      className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${item.leida ? "bg-white" : "bg-emerald-50/70"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm ${item.leida ? "text-gray-600" : "font-medium text-gray-800"}`}>
                          {item.mensaje}
                        </p>
                        {!item.leida && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{formatearFechaNotificacion(item.fecha)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Idioma ── */}
        <LanguageMenu variant={esTemaOscuro ? "dark" : "light"} />

        {/* ── Menú de usuario ── */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setUserMenuOpen(v => !v); setBellOpen(false); }}
            className={`transition ${clsIcono}`}>
            {usuario?.fotoUrl ? (
              <img
                src={usuario.fotoUrl.startsWith("http") ? usuario.fotoUrl : API_URL + usuario.fotoUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <UserCircleIcon className="w-9 h-9" />
            )}
          </button>

          {userMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 bg-white border ${clsBorde} rounded-xl shadow-xl overflow-hidden z-30`} style={{boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"}}>
              {usuario && (
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-800 truncate">{usuario.nombreCompleto}</p>
                  <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                </div>
              )}
              <button
                onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition">
                {t(idioma, "dashboard.perfil")}
              </button>
              <button
                onClick={() => { setUserMenuOpen(false); navigate(obtenerRutaConfiguracion()); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition">
                {t(idioma, "dashboard.configuracion")}
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { setUserMenuOpen(false); setConfirmarCierre(true); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition">
                {t(idioma, "dashboard.cerrarSesion")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmación cierre de sesión */}
      {confirmarCierre && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center border border-gray-100">
            <div className="text-4xl mb-3">👋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">¿Cerrar sesión?</h3>
            <p className="text-sm text-gray-400 mb-6">Podrás volver a entrar cuando quieras.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarCierre(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                Cancelar
              </button>
              <button
                onClick={handleCerrarSesion}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;
