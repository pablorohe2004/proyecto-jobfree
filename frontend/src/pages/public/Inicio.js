import { Link } from "react-router-dom";
import heroProfesionales from "../../assets/images/hero-profesionales.png";

function Inicio() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Soluciones para tu día a día,{" "}
              <span className="text-emerald-500">en un solo lugar.</span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
              Contrata servicios a domicilio de forma rápida y sencilla en una
              sola plataforma para tu hogar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/servicios"
                className="px-7 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition text-sm">
                Ver servicios
              </Link>
              <Link
                to="/registro"
                className="px-7 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm">
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex-1 flex justify-center">
            <img
              src={heroProfesionales}
              alt="Profesionales trabajando en el hogar"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg drop-shadow-xl"
            />
          </div>

        </div>
      </section>

    </div>
  );
}

export default Inicio;
