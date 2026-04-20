import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerServiciosPorSubcategoria } from "api/servicios";
import ServicioOfrecidoCard from "components/cards/ServicioOfrecidoCard";
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

function ServiciosSubcategoria() {

  // id de la subcategoría
  const { id } = useParams();

  // estados
  const [servicios, setServicios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);

  const { idioma } = useLanguage();

  useEffect(() => {
    setLoading(true);

    // llamada al backend con paginación
    obtenerServiciosPorSubcategoria(id, pagina)
      .then(data => {
        setServicios(data.content); // servicios de la página
        setTotalPaginas(data.totalPages); // total de páginas
      })
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));

  }, [id, pagina]);

  // resetear página cuando cambia la subcategoría
  useEffect(() => {
    setPagina(0);
  }, [id]);

  return (
    <div className="px-8 py-10">

      <h3 className="text-3xl font-bold mb-8 text-center">
        {t(idioma, "servicios.listaProfesionales.titulo")}
      </h3>

      {loading ? (
        <p>{t(idioma, "servicios.listaProfesionales.estado.cargando")}</p>
      ) : (
        <>
          {servicios.length === 0 && (
            <p className="text-center">
              {t(idioma, "servicios.listaProfesionales.estado.sinProfesionales")}
            </p>
          )}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* listado de servicios */}
            {servicios.map(servicio => (
              <ServicioOfrecidoCard
                key={servicio.id}
                servicio={servicio}
              />
            ))}

          </div>

          {/* paginación */}
          <div className="flex justify-center gap-4 mt-8">

            <button
              onClick={() => setPagina(p => p - 1)}
              disabled={pagina === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {t(idioma, "servicios.acciones.anterior")}
            </button>

            <span>
              {t(idioma, "servicios.paginacion.pagina")} {pagina + 1} {t(idioma, "servicios.paginacion.de")} {totalPaginas}
            </span>

            <button
              onClick={() => setPagina(p => p + 1)}
              disabled={pagina >= totalPaginas - 1}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {t(idioma, "servicios.acciones.siguiente")}
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default ServiciosSubcategoria;
