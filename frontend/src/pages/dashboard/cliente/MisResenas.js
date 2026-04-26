import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { obtenerMisReservas } from "api/reservas";
import { obtenerMisValoraciones } from "api/valoraciones";

function MisResenas() {
  const [valoraciones, setValoraciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([obtenerMisValoraciones(), obtenerMisReservas()])
      .then(([valoracionesData, reservasData]) => {
        setValoraciones(valoracionesData);
        setReservas(reservasData);
      })
      .catch((err) => setError(err.message || "No se pudieron cargar tus reseñas"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando reseñas...
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  const reservasPorId = new Map(reservas.map((reserva) => [reserva.id, reserva]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Mis reseñas</h1>
        <p className="mt-1 text-sm text-slate-500">Opiniones que has dejado tras completar un servicio.</p>
      </div>

      {valoraciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <StarSolidIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Todavía no has enviado ninguna reseña.</p>
          <Link to="/dashboard/cliente/reservas" className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Ir a mis reservas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {valoraciones.map((valoracion) => {
            const reserva = reservasPorId.get(valoracion.reservaId);
            return (
              <article key={valoracion.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{reserva?.servicioTitulo || "Servicio completado"}</p>
                    <p className="mt-1 text-sm text-slate-500">{reserva?.profesionalNombre || "Profesional"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        className={`h-5 w-5 ${i < valoracion.estrellas ? "text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                {valoracion.comentario && (
                  <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                    {valoracion.comentario}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-400">
                  Enviada el {new Date(valoracion.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisResenas;
