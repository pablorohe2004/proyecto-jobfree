import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtenerSubcategoriasPorCategoria } from "../../../api/subcategorias";
import ServicioCard from "../../../components/cards/ServicioCard";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

function Servicios() {

  // estado donde guardamos las subcategorías obtenidas del backend
  const [subcategorias, setSubcategorias] = useState([]);

  // página actual de la paginación
  const [pagina, setPagina] = useState(0);

  // total de páginas que devuelve el backend
  const [totalPaginas, setTotalPaginas] = useState(0);

  // estado de carga (para mostrar "Cargando...")
  const [loading, setLoading] = useState(true);

  // hook para leer la URL (query params)
  const location = useLocation();

  const { idioma } = useLanguage();

  /**
   * 🔹 Este useEffect se ejecuta cada vez que:
   * - cambia la URL (location.search)
   * - cambia la página (pagina)
   */
  useEffect(() => {

    setLoading(true);

    // obtenemos parámetros de la URL
    const params = new URLSearchParams(location.search);

    // cogemos el id de la categoría (?categoria=1)
    const categoriaId = params.get("categoria");

    // si hay categoría, llamamos al backend
    if (categoriaId) {

      obtenerSubcategoriasPorCategoria(categoriaId, pagina)
        .then(data => {

          // guardamos las subcategorías
          setSubcategorias(data.content);

          // guardamos total de páginas
          setTotalPaginas(data.totalPages);
        })
        .catch(() => {

          // en caso de error, dejamos vacío
          setSubcategorias([]);
        })
        .finally(() => setLoading(false));

    } else {
      // si no hay categoría en la URL → no mostramos nada
      setSubcategorias([]);
      setLoading(false);
    }

  }, [location.search, pagina]);


  /**
   * 🔹 IMPORTANTE:
   * Cuando cambiamos de categoría, reseteamos la página a 0
   * (si no, se quedaría en una página incorrecta)
   */
  useEffect(() => {
    setPagina(0);
  }, [location.search]);


  return (
    <div className="px-8 py-10">

      {/* título */}
      <h3 className="text-3xl font-bold mb-8 text-center">
        {t(idioma, "tituloServicios")}
      </h3>

      {/* estado de carga */}
      {loading ? (
        <p className="text-center">{t(idioma, "cargando")}</p>
      ) : (
        <>
          {/* grid de subcategorías */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {subcategorias.map(sub => (
              <ServicioCard
                key={sub.id}
                subcategoria={sub}
              />
            ))}

          </div>

          {/* paginación */}
          <div className="flex justify-center gap-4 mt-8">

            <button
              onClick={() => setPagina(p => p - 1)}
              disabled={pagina === 0}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              {t(idioma, "anterior")}
            </button>

            <span>
              {t(idioma, "pagina")} {pagina + 1} {t(idioma, "de")} {totalPaginas}
            </span>

            <button
              onClick={() => setPagina(p => p + 1)}
              disabled={pagina >= totalPaginas - 1}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              {t(idioma, "siguiente")}
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Servicios;
