function PlanSuscripcion({ esAnual }) {
    return (
        <>
            {/* cards */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">

                {/* Básico */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">

                    <h3 className="text-xl font-semibold text-gray-900">
                        Básico
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            0€
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual ? "/año" : "/mes"}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            { text: "Perfil visible en la plataforma", included: true },
                            { text: "Elegir zona de trabajo", included: true },
                            { text: "Recibir solicitudes de clientes", included: true },
                            { text: "Recibir valoraciones de clientes", included: true },
                            { text: "Prioridad en búsquedas", included: false },
                            { text: "Perfil destacado", included: false },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-x-3">
                                {/* icono */}
                                <span className={`grid size-5 place-content-center rounded-full text-white ${item.included ? "bg-[#166534]" : "bg-red-300"}`}>
                                    {item.included ? (
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
                        Empezar gratis
                    </button>
                </div>

                {/* PRO */}
                <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-2 ring-[#2596be] scale-105 sm:p-10">

                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2596be] text-white text-xs px-3 py-1 rounded-full">
                        PLAN MÁS POPULAR
                    </span>

                    {/* etiqueta */}
                    <h3 className="text-xl font-semibold text-gray-900">
                        Pro
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "99,99 €" : "9,99 €"}
                        </span>
                        <span className="text-base text-gray-600">
                            {esAnual ? "/año" : "/mes"}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            { text: "Todo lo incluido en el plan Básico", included: true },
                            { text: "Mayor prioridad en búsquedas", included: true },
                            { text: "Perfil destacado", included: true },
                            { text: "Comisiones reducidas", included: true },
                            { text: "Acceder a estadísticas", included: true },
                            { text: "Banner promocional", included: false },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-x-3">
                                {/* icono */}
                                <span className={`grid size-5 place-content-center rounded-full text-white ${item.included ? "bg-[#166534]" : "bg-red-300"}`}>
                                    {item.included ? (
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
                        Obtener PRO
                    </button>
                </div>

                {/* PREMIUM */}
                <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 sm:p-10">

                    <h3 className="text-xl font-semibold text-gray-900">
                        Premium
                    </h3>

                    {/* precio */}
                    <p className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "149,99 €" : "19,99 €"}
                        </span>
                        <span className="text-base text-gray-500">{esAnual ? "/año" : "/mes"}</span>
                    </p>

                    {/* lista */}
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 sm:mt-10">
                        {[
                            "Todo lo incluido en el plan PRO",
                            "Máxima visibilidad",
                            "Insignia 'Top Profesional'",
                            "Comisiones aún más reducidas",
                            "Doble de puntos por servicio",
                            "Soporte prioritario",
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
                        Obtener PREMIUM
                    </button>
                </div>
            </div>
        </>
    );
}

export default PlanSuscripcion;
