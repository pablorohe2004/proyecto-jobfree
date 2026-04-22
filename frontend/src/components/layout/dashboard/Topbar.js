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

function Topbar({ setOpen }) {

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const [query, setQuery] = useState("");
  const [todosServicios, setTodosServicios] = useState([]);
  const [resultados, setResultados] = useState([]);

  const menuRef = useRef();
  const bellRef = useRef();
  const buscadorRef = useRef();

  const navigate = useNavigate();
  const { idioma } = useLanguage();
  const { usuario, cerrarSesion } = useAuth();
  const { tema } = useTheme();

  const esTemaOscuro = tema.texto === "#ffffff";

  useEffect(() => {
    obtenerTodasSubcategorias()
      .then(setTodosServicios)
      .catch(() => {});
  }, []);

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
              backgroundColor: esTemaOscuro ? "rgba(255,255,255,0.1)" : "white",
              borderColor: esTemaOscuro ? "rgba(255,255,255,0.2)" : "#d1d5db",
            }}
            className="w-full rounded-full px-4 py-2 pr-10 border focus:outline-none focus:ring-2 focus:ring-white/30 text-sm placeholder-white/50"
          />
          <MagnifyingGlassIcon className={`w-5 h-5 absolute right-3 top-2.5 ${clsIcono}`} />

          {query.trim().length > 0 && (
            <div className="absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">Notificaciones</span>
                <span className="text-xs text-gray-400">0 nuevas</span>
              </div>
              <div className="py-10 text-center">
                <BellIcon className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No tienes notificaciones</p>
              </div>
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
            <div className={`absolute right-0 mt-2 w-48 bg-white border ${clsBorde} rounded-xl shadow-xl overflow-hidden z-30`}>
              {usuario && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 truncate">{usuario.nombreCompleto}</p>
                  <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                </div>
              )}
              <button
                onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">
                {t(idioma, "dashboard.perfil")}
              </button>
              <button
                onClick={() => { setUserMenuOpen(false); navigate("/configuracion"); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">
                {t(idioma, "dashboard.configuracion")}
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { setUserMenuOpen(false); setConfirmarCierre(true); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500">
                {t(idioma, "dashboard.cerrarSesion")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmación cierre de sesión */}
      {confirmarCierre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center">
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
