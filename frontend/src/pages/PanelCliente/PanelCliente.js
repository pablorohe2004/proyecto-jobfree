import {
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CreditCardIcon,
  HeartIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

function PanelCliente() {
  // elementos del menú lateral
  const menuItems = [
    { nombre: "Inicio", icono: HomeIcon, activo: true },
    { nombre: "Buscar servicios", icono: MagnifyingGlassIcon },
    { nombre: "Reservas", icono: CalendarDaysIcon },
    { nombre: "Mensajes", icono: ChatBubbleLeftRightIcon, badge: 1 },
    { nombre: "Reseñas", icono: StarIcon },
    { nombre: "Facturas", icono: CreditCardIcon },
    { nombre: "Favoritos", icono: HeartIcon },
    { nombre: "Configuración", icono: Cog6ToothIcon },
  ];

  // tarjetas resumen de la parte superior
  const stats = [
    {
      numero: "2",
      texto: "solicitudes activas",
      icono: UsersIcon,
    },
    {
      numero: "12",
      texto: "servicios contratados",
      icono: WrenchScrewdriverIcon,
      extra: "↑ 10% este mes",
    },
    {
      numero: "2",
      texto: "valoraciones pendientes",
      icono: StarIcon,
    },
    {
      numero: "120 €",
      texto: "gastos este mes",
      icono: CreditCardIcon,
    },
  ];

  // listado de profesionales recomendados
  const profesionales = [
    { nombre: "Eva Martín", servicio: "Electricidad", ciudad: "Sevilla", nota: "4.9" },
    { nombre: "Javier Román", servicio: "Clases particulares", ciudad: "Sevilla", nota: "4.8" },
    { nombre: "David Martín", servicio: "Cuidado de mascotas", ciudad: "Sevilla", nota: "4.9" },
  ];

  // barras del gráfico falso
  const serviciosPopulares = [
    { nombre: "Limpieza del hogar", altura: "h-36", destacado: false },
    { nombre: "Electricidad", altura: "h-24", destacado: false },
    { nombre: "Fontanería", altura: "h-44", destacado: true, porcentaje: "35%" },
    { nombre: "Albañilería", altura: "h-20", destacado: false },
    { nombre: "Clases particulares", altura: "h-28", destacado: false },
    { nombre: "Cerrajería", altura: "h-16", destacado: false },
  ];

  // citas próximas
  const citas = [
    { dia: "Mañana", hora: "17:00 PM", servicio: "Electricidad (Juan Antonio Vázquez)" },
    { dia: "Viernes", hora: "12:30 PM", servicio: "Limpieza (Ana María Riera)" },
  ];

  return (
    <div className="min-h-screen bg-[#efeff2] flex flex-col">
      {/* bloque principal con sidebar y contenido */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* sidebar */}
        <aside className="w-full lg:w-[320px] bg-gradient-to-b from-cyan-400 to-emerald-500 text-white flex flex-col justify-between">
          <div className="px-4 py-8">
            <nav className="space-y-3">
              {menuItems.map((item) => {
                const Icono = item.icono;

                return (
                  <button
                    key={item.nombre}
                    className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left transition ${
                      item.activo
                        ? "bg-gradient-to-r from-[#4d26ff] to-[#7a2cff] shadow-lg"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-4 text-lg font-medium">
                      <Icono className="w-7 h-7" />
                      {item.nombre}
                    </span>

                    {item.badge && (
                      <span className="min-w-6 h-6 px-2 rounded-full bg-white text-rose-500 text-xs font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* bloque inferior del usuario */}
          <div className="border-t border-white/30 bg-white/10 px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Alejandro"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/70"
                />
                <div>
                  <p className="font-semibold text-lg">Alejandro</p>
                </div>
              </div>

              <ArrowRightOnRectangleIcon className="w-7 h-7" />
            </div>
          </div>
        </aside>

        {/* contenido central */}
        <main className="flex-1 flex flex-col">
          {/* topbar interna del panel */}
          <header className="bg-[#ececec] px-6 md:px-10 py-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              {/* buscador */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Buscar ..."
                  className="w-full rounded-full bg-white px-6 py-4 pr-14 text-slate-700 outline-none shadow-sm"
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2" />
              </div>

              {/* iconos y usuario */}
              <div className="flex items-center gap-4 md:gap-6 self-end xl:self-auto">
                <div className="relative">
                  <BellIcon className="w-7 h-7 text-slate-700" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    4
                  </span>
                </div>

                <SunIcon className="w-7 h-7 text-slate-700" />
                <QuestionMarkCircleIcon className="w-7 h-7 text-slate-700" />

                <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Alejandro."
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-700">Alejandro</span>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {/* cuerpo */}
          <section className="px-6 md:px-10 py-8">
            <div className="max-w-6xl mx-auto">
              {/* saludo */}
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3">
                  Bienvenido, Alejandro
                </h1>
                <p className="text-2xl text-slate-700">¿Qué necesitas hoy?</p>
              </div>

              {/* estadisitcas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {stats.map((stat) => {
                  const Icono = stat.icono;

                  return (
                    <article
                      key={stat.texto}
                      className="bg-[#e8e8f7] rounded-3xl px-6 py-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Icono className="w-8 h-8 text-emerald-500" />
                        </div>

                        <div>
                          <p className="text-4xl font-bold text-slate-800 leading-none">
                            {stat.numero}
                          </p>
                          <p className="text-lg text-slate-700 font-semibold mt-1">
                            {stat.texto}
                          </p>
                          {stat.extra && (
                            <p className="text-sm text-emerald-500 font-semibold mt-1">
                              {stat.extra}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* recomendados */}
              <section className="bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-6 mb-10">
                <h2 className="text-2xl font-bold text-emerald-600 mb-5">
                  Profesionales recomendados para ti
                </h2>

                <div className="space-y-4">
                  {profesionales.map((pro) => (
                    <div
                      key={pro.nombre}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-sky-100 rounded-2xl px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?u=${pro.nombre}`}
                          alt={pro.nombre}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                        <div className="text-slate-700">
                          <p className="font-semibold">{pro.nombre}</p>
                          <p className="text-sm">
                            {pro.servicio} <span className="text-slate-500">({pro.ciudad})</span>
                          </p>
                        </div>
                      </div>

                      <div className="self-start md:self-auto inline-flex items-center gap-1 rounded-full bg-lime-100 px-3 py-1 text-lime-600 font-bold">
                        <StarIcon className="w-5 h-5" />
                        {pro.nota}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* zona media con grafico y las citas.... */}
              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
                {/* gráfico */}
                <section className="bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">
                    Servicios más buscados cerca de ti
                  </h2>

                  <div className="flex items-end justify-between gap-4 min-h-[280px]">
                    {serviciosPopulares.map((servicio) => (
                      <div
                        key={servicio.nombre}
                        className="flex-1 flex flex-col items-center justify-end"
                      >
                        {servicio.destacado && (
                          <span className="mb-3 rounded-lg bg-black text-white text-xs font-bold px-2 py-1">
                            {servicio.porcentaje}
                          </span>
                        )}

                        <div
                          className={`w-full max-w-[48px] rounded-xl border border-slate-300 ${
                            servicio.destacado
                              ? "bg-gradient-to-b from-[#6a39ff] to-[#5030f7]"
                              : "bg-[#e6e4f1]"
                          } ${servicio.altura}`}
                        />

                        <p className="text-center text-xs text-slate-600 mt-3 leading-tight">
                          {servicio.nombre}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* citas */}
                <section className="bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-6 self-start">
                  <h2 className="text-2xl font-bold text-emerald-600 mb-5">
                    Próximas citas
                  </h2>

                  <div className="space-y-4">
                    {citas.map((cita) => (
                      <div
                        key={`${cita.dia}-${cita.hora}`}
                        className="bg-[#ece6d8] rounded-2xl px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                      >
                        <p className="font-bold text-slate-800 text-lg">{cita.dia}</p>
                        <p className="font-semibold text-slate-700">{cita.hora}</p>
                        <p className="text-slate-600">{cita.servicio}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>

    </div>
  );
}

export default PanelCliente;