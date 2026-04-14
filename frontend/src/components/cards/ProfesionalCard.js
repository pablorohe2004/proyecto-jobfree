import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../i18n";

function ProfesionalCard({ profesional }) {
  const { idioma } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 max-w-sm">

      {/* nombre */}
      <h3 className="text-lg font-semibold">
        {profesional.nombre}
      </h3>

      {/* ciudad */}
      <p className="text-gray-600 text-sm">
        {profesional.ciudad}
      </p>

      {/* valoración */}
      <p className="text-yellow-500 text-sm mt-2">
        ⭐ {profesional.valoracionMedia} ({profesional.numeroValoraciones} {t(idioma, "opiniones")})
      </p>

      {/* precio */}
      <p className="text-gray-800 mt-2">
        {t(idioma, "desde")} {profesional.precioHora}€/{t(idioma, "hora")}
      </p>

      {/* descripción */}
      <p className="text-gray-600 text-sm mt-2">
        {profesional.descripcion}
      </p>

      {/* botones */}
      <div className="flex gap-2 mt-4">
        <Link
          to={"/profesional/" + profesional.id}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          {t(idioma, "verPerfil")}
        </Link>

        <button className="px-4 py-2 bg-green-500 text-white rounded-md">
          {t(idioma, "contratar")}
        </button>
      </div>

    </div>
  );
}

export default ProfesionalCard;
