import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../i18n";

function PlanSuscripcion({ esAnual }) {
    const { idioma } = useLanguage();
    return (
        <>
            {/* cards */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">

                {/* BASICO */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planBasico")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            0€
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual ? t(idioma, "anio") : t(idioma, "mes")}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            { text: t(idioma, "feat1"), ok: true },
                            { text: t(idioma, "feat2"), ok: true },
                            { text: t(idioma, "feat3"), ok: true },
                            { text: t(idioma, "feat4"), ok: true },
                            { text: t(idioma, "feat5"), ok: false },
                            { text: t(idioma, "feat6"), ok: false },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-x-3">
                                {/* icono */}
                                <span className={`grid size-5 place-content-center rounded-full text-white ${item.ok ? "bg-[#166534]" : "bg-red-300"}`}>
                                    {item.ok ? (
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            height="1em"
                                            width="1em">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            height="1em"
                                            width="1em">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    )}
                                </span>
                                {item.text}
                            </li>
                        ))}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "empezarGratis")}
                    </button>
                </div>

                {/* PRO */}
                <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-2 ring-[#2596be] scale-105 sm:p-10">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2596be] text-white text-xs px-3 py-1 rounded-full">
                        {t(idioma, "planPopular")}
                    </span>

                    {/* etiqueta */}
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planPro")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "99,99 €" : "9,99 €"}
                        </span>
                        <span className="text-base text-gray-600">
                            {esAnual ? t(idioma, "anio") : t(idioma, "mes")}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            { text: t(idioma, "pro1"), ok: true },
                            { text: t(idioma, "pro2"), ok: true },
                            { text: t(idioma, "pro3"), ok: true },
                            { text: t(idioma, "pro4"), ok: true },
                            { text: t(idioma, "pro5"), ok: false },
                            { text: t(idioma, "pro6"), ok: false },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-x-3">
                                {/* icono */}
                                <span
                                    className={`grid size-5 place-content-center rounded-full text-white ${item.ok ? "bg-[#166534]" : "bg-red-300"}`}>
                                    {item.ok ? (
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            height="1em"
                                            width="1em">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            height="1em"
                                            width="1em">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    )}
                                </span>
                                {item.text}
                            </li>
                        ))}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "obtenerPro")}
                    </button>
                </div>

                {/* PREMIUM */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t(idioma, "planPremium")}
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "149,99 €" : "19,99 €"}
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual ? t(idioma, "anio") : t(idioma, "mes")}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            t(idioma, "premium1"),
                            t(idioma, "premium2"),
                            t(idioma, "premium3"),
                            t(idioma, "premium4"),
                            t(idioma, "premium5"),
                            t(idioma, "premium6"),
                        ].map((item, i) => (
                            <li key={i} className="flex gap-x-3">
                                {/* icono */}
                                <span className="grid size-5 place-content-center rounded-full bg-[#166534] text-sm text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        height="1em"
                                        width="1em">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* botón */}
                    <button className="mt-8 w-full rounded-md bg-[#2596be] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] sm:mt-10">
                        {t(idioma, "obtenerPremium")}
                    </button>
                </div>
            </div>
        </>
    );
}

export default PlanSuscripcion;
