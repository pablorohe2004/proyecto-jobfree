import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";
import { textos } from "i18n";

function PlanSuscripcion({ esAnual }) {
    const { idioma } = useLanguage();
    const { planes } = textos[idioma];

    const featuresBasico = planes.features.basico;
    const featuresPro = planes.features.pro;
    const featuresPremium = planes.features.premium;

    const limiteBasico = featuresBasico.length - 2;
    const limitePro = featuresPro.length - 2;

    return (
        <>
            {/* cards */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">

                {/* BASICO */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planes.tipos.basico")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            0€
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual
                                ? t(idioma, "planes.periodo.anio")
                                : t(idioma, "planes.periodo.mes")}
                        </span>
                    </p>

                    <ul className="mt-8 space-y-3 text-sm text-gray-800 sm:mt-10">
                        {featuresBasico.map((text, i) => {

                            const ok = i < limiteBasico;

                            return (
                                <li key={i} className="flex gap-x-3">
                                    {/* icono */}
                                    <span className={`grid size-5 place-content-center rounded-full text-white ${ok ? "bg-[#166534]" : "bg-red-300"}`}>
                                        {ok ? (
                                            <svg className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>

                                    {text}
                                </li>
                            );
                        })}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "planes.botones.gratis")}
                    </button>
                </div>

                {/* PRO */}
                <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-2 ring-[#2596be] scale-105 sm:p-10">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2596be] text-white text-xs px-3 py-1 rounded-full">
                        {t(idioma, "planes.tipos.popular")}
                    </span>

                    {/* etiqueta */}
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planes.tipos.pro")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "99,99 €" : "9,99 €"}
                        </span>
                        <span className="text-base text-gray-800">
                            {esAnual
                                ? t(idioma, "planes.periodo.anio")
                                : t(idioma, "planes.periodo.mes")}
                        </span>
                    </p>

                    <ul className="mt-8 space-y-3 text-sm text-gray-800 sm:mt-10">
                        {featuresPro.map((text, i) => {

                            const ok = i < limitePro;

                            return (
                                <li key={i} className="flex gap-x-3">

                                    {/* icono */}
                                    <span
                                        className={`grid size-5 place-content-center rounded-full text-white ${ok ? "bg-[#166534]" : "bg-red-300"
                                            }`}
                                    >
                                        {ok ? (
                                            <svg className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>

                                    {text}
                                </li>
                            );
                        })}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "planes.botones.pro")}
                    </button>
                </div>

                {/* PREMIUM */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planes.tipos.premium")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "149,99 €" : "19,99 €"}
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual
                                ? t(idioma, "planes.periodo.anio")
                                : t(idioma, "planes.periodo.mes")}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-800 sm:mt-10">
                        {featuresPremium.map((text, i) => (
                            <li key={i} className="flex gap-x-3">

                                {/* icono */}
                                <span className="grid size-5 place-content-center rounded-full bg-[#166534] text-white">
                                    <svg className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>

                                {text}
                            </li>
                        ))}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "planes.botones.premium")}
                    </button>
                </div>
            </div>
        </>
    );
}

export default PlanSuscripcion;
