import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

// importamos idioma
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";
import LanguageMenu from "../public/LanguageMenu";

// importamos la sesión para mostrar el nombre real y poder cerrar sesión
import { useAuth } from "../../../context/AuthContext";

// función para cargar los servicios activos del backend
import { obtenerServiciosActivos } from "../../../api/servicios";

function Topbar({ setOpen }) {

  // controla apertura del menú de usuario
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // texto que escribe el usuario en el buscador
  const [query, setQuery] = useState("");

  // lista completa de servicios activos — se carga una sola vez al montar
  const [todosServicios, setTodosServicios] = useState([]);

  // resultados filtrados que se muestran en el dropdown
  const [resultados, setResultados] = useState([]);

  // referencia para detectar click fuera del menú de usuario
  const menuRef = useRef();

  // referencia para detectar click fuera del buscador y cerrar el dropdown
  const buscadorRef = useRef();

  const navigate = useNavigate();
  const { idioma } = useLanguage();

  // obtenemos el usuario logueado y la función de logout del contexto global
  const { usuario, cerrarSesion } = useAuth();

  // Cargamos todos los servicios activos al montar el componente.
  // Como el endpoint /servicios/activos es público, no necesitamos token.
  // Una sola carga es suficiente — mientras el Topbar esté montado, los datos están en memoria.
  useEffect(() => {
    obtenerServiciosActivos()
      .then(setTodosServicios)
      .catch(() => {}); // si falla, el buscador simplemente no muestra resultados
  }, []);

  // Cierra el menú de usuario y limpia el buscador si el click ocurre fuera de cada uno
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setQuery("");
        setResultados([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Filtra la lista de servicios en tiempo real mientras el usuario escribe.
   * No hace ninguna llamada al backend — los datos ya están en memoria.
   */
  function handleQuery(e) {
    const valor = e.target.value;
    setQuery(valor);

    if (!valor.trim()) {
      setResultados([]);
      return;
    }

    const filtrados = todosServicios.filter(s =>
      s.titulo.toLowerCase().includes(valor.toLowerCase().trim())
    );

    // Mostramos máximo 6 resultados para no sobrecargar el dropdown
    setResultados(filtrados.slice(0, 6));
  }

  /**
   * Al pulsar Enter: navega a la subcategoría del primer resultado si hay alguno,
   * o a la página general de servicios si no hay coincidencias.
   * Escape cierra el dropdown sin navegar.
   */
  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      if (resultados.length > 0) {
        navigate(`/servicios/subcategoria/${resultados[0].subcategoriaId}`);
      } else {
        navigate("/servicios");
      }
      setQuery("");
      setResultados([]);
    }
    if (e.key === "Escape") {
      setQuery("");
      setResultados([]);
    }
  }

  /**
   * Cierra la sesión y redirige al inicio.
   */
  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <header className="h-16 w-full bg-gray-100 border-b flex items-center px-6 fixed top-0 right-0 left-0 md:left-64 z-30">

      {/* botón menú móvil (solo visible en pantallas pequeñas) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden mr-4">
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* buscador con dropdown de resultados */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-72 ml-2" ref={buscadorRef}>

          <input
            type="text"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            placeholder={t(idioma, "buscar")}
            className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />

          {/* Dropdown — solo aparece cuando hay algo escrito */}
          {query.trim().length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">

              {resultados.length > 0 ? (
                resultados.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      navigate(`/servicios/subcategoria/${s.subcategoriaId}`);
                      setQuery("");
                      setResultados([]);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b last:border-0">
                    {s.titulo}
                  </button>
                ))
              ) : (
                // Si no hay coincidencias mostramos el mensaje de "sin resultados"
                <p className="px-4 py-3 text-sm text-gray-400">
                  {t(idioma, "sinResultados")}
                </p>
              )}

            </div>
          )}
        </div>
      </div>

      {/* zona derecha */}
      <div className="flex items-center gap-6">

        {/* icono notificaciones */}
        <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />

        <LanguageMenu variant="light" />

        {/* menú de usuario */}
        <div className="relative" ref={menuRef}>

          {/* botón con el icono de usuario */}
          <button onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserCircleIcon className="w-9 h-9 text-gray-600" />
          </button>

          {/* menú desplegable */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden z-20">

              {/* nombre del usuario logueado */}
              {usuario && (
                <div className="px-4 py-2 text-xs text-gray-400 border-b truncate">
                  {usuario.nombreCompleto}
                </div>
              )}

              {/* perfil */}
              <button
                onClick={() => navigate("/perfil")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                {t(idioma, "perfil")}
              </button>

              {/* configuración */}
              <button
                onClick={() => navigate("/configuracion")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                {t(idioma, "configuracion")}
              </button>

              {/* cerrar sesión */}
              <button
                onClick={handleCerrarSesion}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500">
                {t(idioma, "cerrarSesion")}
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
