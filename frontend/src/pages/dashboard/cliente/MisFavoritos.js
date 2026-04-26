import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon, HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { eliminarFavorito, obtenerMisFavoritos } from "api/favoritos";
import API_URL from "api/config";

function MisFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerMisFavoritos()
      .then(setFavoritos)
      .catch((err) => setError(err.message || "No se pudieron cargar tus favoritos"))
      .finally(() => setLoading(false));
  }, []);

  async function quitar(servicioId) {
    try {
      await eliminarFavorito(servicioId);
      setFavoritos((prev) => prev.filter((item) => item.servicio.id !== servicioId));
    } catch (err) {
      alert(err.message || "No se pudo eliminar el favorito.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando favoritos...
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Mis favoritos</h1>
        <p className="mt-1 text-sm text-slate-500">Servicios guardados para volver a ellos más tarde.</p>
      </div>

      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <HeartIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Aún no has guardado ningún servicio.</p>
          <p className="mt-1 text-xs text-slate-400">Cuando pulses el corazón en un servicio, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {favoritos.map((item) => {
            const servicio = item.servicio;
            const foto = servicio.fotoUrlProfesional
              ? servicio.fotoUrlProfesional.startsWith("http")
                ? servicio.fotoUrlProfesional
                : API_URL + servicio.fotoUrlProfesional
              : null;

            return (
              <article key={item.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {foto ? (
                      <img src={foto} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow" />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                        {(servicio.nombreProfesional || "?").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{servicio.nombreProfesional}</p>
                      <p className="text-xs text-slate-500">{servicio.ciudadProfesional || "Zona no indicada"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => quitar(servicio.id)}
                    className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    aria-label="Quitar de favoritos"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="mt-4 text-base font-semibold text-slate-900">{servicio.titulo}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">{servicio.descripcion}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{Number(servicio.precioHora).toFixed(0)}€/h</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <StarSolidIcon className="h-4 w-4 text-amber-400" />
                      {servicio.valoracionMedia ? Number(servicio.valoracionMedia).toFixed(1) : "Sin reseñas"}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/cliente/buscar/profesionales/${servicio.subcategoriaId}`}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Ver servicio
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisFavoritos;
