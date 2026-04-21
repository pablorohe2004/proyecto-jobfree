import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import logo from "assets/images/logo.png";
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";
import { obtenerServiciosActivos } from "api/servicios";

function Header() {

  const { idioma } = useLanguage();
  const navigate = useNavigate();

  // texto que escribe el usuario
  const [query, setQuery] = useState("");

  // lista completa cargada una vez al montar
  const [todosServicios, setTodosServicios] = useState([]);

  // resultados filtrados para el dropdown
  const [resultados, setResultados] = useState([]);

  // referencia para cerrar el dropdown al hacer click fuera
  const buscadorRef = useRef();

  // Cargamos los servicios activos al montar el componente
  useEffect(() => {
    obtenerServiciosActivos()
      .then(setTodosServicios)
      .catch(() => { }); // si falla, el buscador simplemente no sugiere nada
  }, []);

  // Cierra el dropdown si el usuario hace click fuera del buscador
  useEffect(() => {
    function handleClickOutside(event) {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setQuery("");
        setResultados([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Filtra los servicios en memoria según lo que escribe el usuario.
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

    setResultados(filtrados.slice(0, 6));
  }

  /**
   * Enter: navega al primer resultado o a /servicios si no hay ninguno.
   * Escape: cierra el dropdown.
   */
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // evitamos que el form haga submit real
      if (resultados.length > 0) {
        navigate(`/servicios/subcategoria/${resultados[0].subcategoriaId}`);
      } else if (query.trim()) {
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

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-100 border-b">

      {/* logo */}
      <Link to="/">
        <img src={logo} className="h-16" alt="Logo de JobFree" />
      </Link>

      {/* buscador con dropdown */}
      <div className="w-full md:flex-1 flex justify-center">
        <div className="relative w-full max-w-md" ref={buscadorRef}>

          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            placeholder={t(idioma, "nav.buscar")}
            aria-label={t(idioma, "nav.buscar")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Dropdown — aparece solo cuando hay texto */}
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
                <p className="px-4 py-3 text-sm text-gray-400">
                  {t(idioma, "servicios.estado.sinResultados")}
                </p>
              )}

            </div>
          )}
        </div>
      </div>

      {/* botones de autenticación */}
      <nav className="flex gap-3">

        <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-50 transition font-medium">
          {t(idioma, "auth.general.iniciarSesion")}
        </Link>

        <Link to="/registro" className="bg-blue-600 text-white px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-700 hover:shadow-md transition font-medium">
          {t(idioma, "auth.general.registrarse")}
        </Link>

      </nav>

    </header>
  );
}

export default Header;
