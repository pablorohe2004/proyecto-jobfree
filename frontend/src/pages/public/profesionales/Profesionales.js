import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerServiciosPorSubcategoria } from "api/servicios";
import { StarIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

function Profesionales() {

  // id de la subcategoría desde la URL
  const { id } = useParams();

  // estados
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const { idioma } = useLanguage();

  useEffect(() => {
    setLoading(true);

    // llamada a la API
    obtenerServiciosPorSubcategoria(id)
      .then(data => setServicios(data))
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));

  }, [id]);

  return (
    <div className="px-8 py-10">

      <h2 className="text-2xl font-bold mb-6">
        {t(idioma, "servicios.listaProfesionales.titulo")}
      </h2>

      {/* loading */}
      {loading && (
        <p>{t(idioma, "servicios.listaProfesionales.estado.cargando")}</p>
      )}

      {/* sin resultados */}
      {!loading && servicios.length === 0 && (
        <p>{t(idioma, "servicios.listaProfesionales.estado.sinProfesionales")}</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {servicios.map(servicio => {

          const profesional = servicio.profesional;
          const usuario = profesional?.usuario;

          return (
            <div key={servicio.id} className="bg-white p-5 rounded-lg shadow">

              <h3 className="text-lg font-semibold">
                {usuario?.nombre}
              </h3>

              <p className="text-gray-600">
                {usuario?.ciudad}
              </p>

              <p className="mt-2 flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-5 h-5" />
                {profesional?.valoracionMedia}{" "}
                {t(idioma, "servicios.cards.reviews", {
                  count: profesional?.numeroValoraciones
                })}
              </p>

              <p className="mt-2 font-medium">
                {t(idioma, "servicios.cards.precioHora", { precio: servicio.precioHora })}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {servicio.descripcion}
              </p>

              {/* botones */}
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1 bg-gray-200 rounded">
                  {t(idioma, "servicios.cards.verPerfil")}
                </button>

                <button className="px-3 py-1 bg-green-500 text-white rounded">
                  {t(idioma, "servicios.cards.contratar")}
                </button>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Profesionales;
