import { useState } from "react";
import PlanSuscripcion from "components/cards/PlanSuscripcion";

// idioma
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

function ParaProfesionales() {

  const [esAnual, setEsAnual] = useState(false);
  const { idioma } = useLanguage();

  return (
    <div className="relative isolate bg-[#F2FFF3] px-6 py-16 sm:py-20 lg:px-8">

      {/* título */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
          {t(idioma, "planes.titulo")}
        </p>
      </div>

      {/* descripción */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-base sm:text-lg font-medium text-gray-600 leading-relaxed">
        {t(idioma, "planes.descripcion")}
      </p>

      {/* switch mensual/anual */}
      <div className="mt-10 flex justify-center">
        <div className="flex bg-zinc-300 p-1.5 rounded-full">

          <button
            onClick={() => setEsAnual(false)} // cambia a mensual
            className={`px-4 py-2 rounded-full text-xs transition ${!esAnual ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
            {t(idioma, "planes.tipoPago.mensual")}
          </button>

          <button
            onClick={() => setEsAnual(true)} // cambia a anual
            className={`px-4 py-2 rounded-full text-xs transition ${esAnual ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
            {t(idioma, "planes.tipoPago.anual")}
          </button>

        </div>

      </div>

      {/* aviso descuento */}
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[#2596be]">
          {t(idioma, "planes.tipoPago.descuento")}
        </p>
      </div>

      <PlanSuscripcion esAnual={esAnual} />
    </div>
  );
}

export default ParaProfesionales;
