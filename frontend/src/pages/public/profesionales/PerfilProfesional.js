import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon, BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { obtenerProfesionalPorId } from "api/profesional";
import { obtenerServiciosActivosPorProfesionalUsuario } from "api/servicios";
import { obtenerValoracionesPorProfesional } from "api/valoraciones";
import API_URL from "api/config";

function PerfilProfesional() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    obtenerProfesionalPorId(id)
      .then(async (perfilData) => {
        if (!activo) return;
        setPerfil(perfilData);

        const [serviciosData, valoracionesData] = await Promise.all([
          obtenerServiciosActivosPorProfesionalUsuario(perfilData.usuarioId),
          obtenerValoracionesPorProfesional(perfilData.id),
        ]);

        if (!activo) return;
        setServicios(serviciosData);
        setValoraciones(valoracionesData);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || "No se pudo cargar el perfil del profesional");
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        Cargando perfil...
      </div>
    );
  }

  if (error || !perfil) {
    return <p className="py-16 text-center text-sm text-red-500">{error || "Perfil no encontrado"}</p>;
  }

  const foto = perfil.fotoUrl
    ? perfil.fotoUrl.startsWith("http")
      ? perfil.fotoUrl
      : API_URL + perfil.fotoUrl
    : null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fafc_0%,_#edf4f7_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to={-1} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </Link>

        <section className="mt-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {foto ? (
              <img src={foto} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white">
                {(perfil.nombreCompleto || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-emerald-600">Perfil profesional</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{perfil.nombreCompleto}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4" />
                  {perfil.ciudad || "Ubicación no indicada"}
                </span>
                <span className="flex items-center gap-1.5">
                  <BriefcaseIcon className="h-4 w-4" />
                  {perfil.experiencia || 0} años de experiencia
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <StarSolidIcon className="h-4 w-4 text-amber-400" />
                  {perfil.valoracionMedia ? Number(perfil.valoracionMedia).toFixed(1) : "Sin reseñas"} 
                  {perfil.numeroValoraciones ? ` (${perfil.numeroValoraciones})` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Sobre mí</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {perfil.descripcion || "Este profesional aún no ha añadido una descripción."}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Datos</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p><span className="font-medium text-slate-800">Empresa:</span> {perfil.nombreEmpresa || "No indicada"}</p>
                <p><span className="font-medium text-slate-800">Código postal:</span> {perfil.codigoPostal || "No indicado"}</p>
                <p><span className="font-medium text-slate-800">Plan:</span> {perfil.plan || "BÁSICO"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Servicios publicados</h2>
          {servicios.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Este profesional no tiene servicios activos ahora mismo.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {servicios.map((servicio) => (
                <article key={servicio.id} className="rounded-3xl border border-slate-200 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{servicio.titulo}</h3>
                  <p className="mt-2 text-sm text-slate-500">{servicio.descripcion}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-800">{Number(servicio.precioHora).toFixed(0)}€/hora</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Reseñas recibidas</h2>
          {valoraciones.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Todavía no ha recibido reseñas.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {valoraciones.map((valoracion) => (
                <article key={valoracion.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-5 w-5 ${i < valoracion.estrellas ? "text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(valoracion.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  {valoracion.comentario && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{valoracion.comentario}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default PerfilProfesional;
