import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../i18n";

function Inicio() {

  const { idioma } = useLanguage();

  return (
    <section className="py-16 px-6 bg-gray-50 text-center">

      {/* título */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        JobFree
      </h1>

      {/* descripción */}
      <p className="text-lg text-gray-600 mb-10">
        {t(idioma, "inicio.descripcion")}
      </p>

      {/* botones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">

        <Link
          to="/dashboard/profesional"
          className="px-6 py-3 rounded-full bg-green-500 text-white hover:bg-green-600">
          {t(idioma, "inicio.entrarProfesional")}
        </Link>

        <Link
          to="/dashboard/cliente"
          className="px-6 py-3 rounded-full bg-green-500 text-white hover:bg-green-600">
          {t(idioma, "inicio.entrarCliente")}
        </Link>

      </div>

    </section>
  );
}

export default Inicio;
