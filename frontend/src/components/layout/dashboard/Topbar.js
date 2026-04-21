import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  SwatchIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";
import LanguageMenu from "components/layout/public/LanguageMenu";
import { useAuth } from "context/AuthContext";
import { useTheme, TEMAS } from "context/ThemeContext";
import { obtenerServiciosActivos } from "api/servicios";

function Topbar({ setOpen }) {

  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [bellOpen,      setBellOpen]      = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const [query,          setQuery]          = useState("");
  const [todosServicios, setTodosServicios] = useState([]);
  const [resultados,     setResultados]     = useState([]);

  const menuRef    = useRef();
  const colorRef   = useRef();
  const bellRef    = useRef();
  const buscadorRef = useRef();

  const navigate        = useNavigate();
  const { idioma }      = useLanguage();
  const { usuario, cerrarSesion } = useAuth();
  const { tema, cambiarTema }     = useTheme();

  const esTemaOscuro = tema.texto === "#ffffff";

  useEffect(() => {
    obtenerServiciosActivos()
      .then(setTodosServicios)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current    && !menuRef.current.contains(e.target))    setUserMenuOpen(false);
      if (colorRef.current   && !colorRef.current.contains(e.target))   setColorMenuOpen(false);
      if (bellRef.current    && !bellRef.current.contains(e.target))    setBellOpen(false);
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setQuery(""); setResultados([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleQuery(e) {
    const valor = e.target.value;
    setQuery(valor);
    if (!valor.trim()) { setResultados([]); return; }
    setResultados(
      todosServicios
        .filter(s => s.titulo.toLowerCase().includes(valor.toLowerCase().trim()))
        .slice(0, 6)
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      navigate(resultados.length > 0
        ? `/servicios/subcategoria/${resultados[0].subcategoriaId}`
        : "/servicios"
      );
      setQuery(""); setResultados([]);
    }
    if (e.key === "Escape") { setQuery(""); setResultados([]); }
  }

  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/");
  }

  // Clases de texto adaptadas al tema
  const clsIcono   = esTemaOscuro ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-700";
  const clsBorde   = esTemaOscuro ? "border-white/10" : "border-gray-200";

  return (
    <header
      style={{ backgroundColor: tema.bg, borderColor: tema.borde }}
      className="h-16 w-full border-b flex items-center px-6 fixed top-0 right-0 left-0 md:left-64 z-30 transition-colors duration-300"
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
            className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm placeholder-white/50"
            style={{ color: tema.texto, backgroundColor: esTemaOscuro ? "rgba(255,255,255,0.1)" : "white", borderColor: esTemaOscuro ? "rgba(255,255,255,0.2)" : "#d1d5db" }}
          />
          <MagnifyingGlassIcon className={`w-5 h-5 absolute right-3 top-2.5 ${clsIcono}`} />

          {query.trim().length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {resultados.length > 0 ? (
                resultados.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { navigate(`/servicios/subcategoria/${s.subcategoriaId}`); setQuery(""); setResultados([]); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b last:border-0">
                    {s.titulo}
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
      <div className="flex items-center gap-4">

        {/* ── Notificaciones ── */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => { setBellOpen(v => !v); setUserMenuOpen(false); setColorMenuOpen(false); }}
            className={`relative p-1.5 rounded-full transition ${clsIcono}`}>
            <BellIcon className="w-6 h-6" />
            {/* badge — quitar cuando no haya notificaciones */}
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

        {/* ── Color del tema ── */}
        <div className="relative" ref={colorRef}>
          <button
            onClick={() => { setColorMenuOpen(v => !v); setUserMenuOpen(false); setBellOpen(false); }}
            className={`p-1.5 rounded-full transition ${clsIcono}`}
            title="Cambiar color">
            <SwatchIcon className="w-6 h-6" />
          </button>

          {colorMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 p-4 w-52">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Color del panel</p>
              <div className="grid grid-cols-3 gap-2">
                {TEMAS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => cambiarTema(t.id)}
                    title={t.id}
                    className="relative w-full aspect-square rounded-xl border-2 transition hover:scale-105"
                    style={{ backgroundColor: t.bg, borderColor: tema.id === t.id ? "#10b981" : "#e5e7eb" }}>
                    {tema.id === t.id && (
                      <CheckIcon className="w-4 h-4 absolute inset-0 m-auto" style={{ color: t.texto }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Menú de usuario ── */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setUserMenuOpen(v => !v); setColorMenuOpen(false); setBellOpen(false); }}
            className={`transition ${clsIcono}`}>
            <UserCircleIcon className="w-9 h-9" />
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
