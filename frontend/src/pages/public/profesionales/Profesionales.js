import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerServiciosPorSubcategoria } from "../../../api/servicios";
import { StarIcon } from "@heroicons/react/24/solid";

import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

function Profesionales() {

  // id de la subcategoría que viene en la URL
  const { id } = useParams();
  const { idioma } = useLanguage();

  const [servicios, setServicios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // La API devuelve una respuesta paginada — necesitamos .content para el array de datos
    obtenerServiciosPorSubcategoria(id, pagina)
      .then(data => {
        setServicios(data.content);
        setTotalPaginas(data.totalPages);
      })
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));

  }, [id, pagina]);

  return (
    <div className="px-8 py-10">

      <h2 className="text-2xl font-bold mb-6">
        Profesionales disponibles
      </h2>

      {loading && <p>{t(idioma, "cargando")}</p>}

      {!loading && servicios.length === 0 && (
        <p className="text-gray-500">{t(idioma, "sinResultados")}</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {servicios.map(servicio => (
          <div key={servicio.id} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">

            {/* nombre del profesional — viene aplanado en el DTO */}
            <h3 className="text-lg font-semibold text-gray-900">
              {servicio.nombreProfesional}
            </h3>

            {/* ciudad */}
            <p className="text-gray-500 text-sm">
              {servicio.ciudadProfesional}
            </p>

            {/* valoración */}
            <p className="mt-2 flex items-center gap-1 text-yellow-500 text-sm">
              <StarIcon className="w-4 h-4" />
              {servicio.valoracionMedia} ({servicio.numeroValoraciones} {t(idioma, "opiniones")})
            </p>

            {/* servicio y precio */}
            <p className="mt-2 font-medium text-gray-800">
              {servicio.titulo}
            </p>

            <p className="text-green-600 font-semibold">
              {t(idioma, "desde")} {servicio.precioHora}€/{t(idioma, "hora")}
            </p>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {servicio.descripcion}
            </p>

            {/* botones */}
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                {t(idioma, "verPerfil")}
              </button>

              <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition">
                {t(idioma, "contratar")}
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* paginación — solo si hay más de una página */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={() => setPagina(p => p - 1)}
            disabled={pagina === 0}
            className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50">
            {t(idioma, "anterior")}
          </button>

          <span className="self-center text-sm text-gray-600">
            {pagina + 1} / {totalPaginas}
          </span>

          <button
            onClick={() => setPagina(p => p + 1)}
            disabled={pagina >= totalPaginas - 1}
            className="px-4 py-2 bg-green-500 text-white rounded-full disabled:opacity-50">
            {t(idioma, "siguiente")}
          </button>

        </div>
      )}

    </div>
  );
}

export default Profesionales;
