import { Link } from "react-router-dom";

function Inicio() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 px-6 py-16">
      <div className="max-w-4xl text-center">
        {/* título principal */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6">
          JobFree
        </h1>

        {/* texto descriptivo */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Plataforma para contratar servicios a domicilio de forma rápida,
          cómoda y segura.
        </p>

        {/* botones de entrada por tipo de usuario */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/panel-profesional"
            className="px-8 py-3 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 transition"
          >
            Entrar como Profesional
          </Link>

          <Link
            to="/panel-cliente"
            className="px-8 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition shadow-md"
          >
            Entrar como Cliente
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Inicio;