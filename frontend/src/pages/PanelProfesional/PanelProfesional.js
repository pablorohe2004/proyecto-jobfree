import {
  // Iconos para el menú lateral importados de react
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  CreditCardIcon,
  Cog6ToothIcon,

  // Iconos de la barra superior
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  SunIcon,

  // Iconos de las tarjetas resumen
  UsersIcon,

  // Iconos decorativos del mapa
  MapPinIcon,
} from "@heroicons/react/24/outline";

import {
  // Iconos sólidos para avatar y salida
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

function PanelProfesional() {
  // Opciones del sidebar, donde marcamos los iconos y su nombre, de momento sin que lleven a ningun sitio

  const menuItems = [
    { nombre: "Panel principal", icono: Squares2X2Icon, activo: true },
    { nombre: "Solicitudes", icono: ClipboardDocumentListIcon },
    { nombre: "Mensajes", icono: ChatBubbleLeftRightIcon, badge: 3 },
    { nombre: "Mi calendario", icono: CalendarDaysIcon },
    { nombre: "Mis servicios", icono: WrenchScrewdriverIcon },
    { nombre: "Reseñas", icono: StarIcon },
    { nombre: "Mi plan", icono: CreditCardIcon },
    { nombre: "Configuración", icono: Cog6ToothIcon },
  ];

// tarjetas resymen de arriba
  const stats = [
    {
      numero: "24",
      texto: "solicitudes este mes",
      icono: UsersIcon,
      extraColor: "text-emerald-500",
    },
    {
      numero: "4.9",
      texto: "valoración media",
      icono: StarIcon,
    },
    {
      numero: "127",
      texto: "trabajos completados",
      icono: WrenchScrewdriverIcon,
      extraColor: "text-rose-500",
    },
    {
      numero: "1.840 €",
      texto: "ganancias este mes",
      icono: CreditCardIcon,
    },
  ];


  //Mensajes recientes, de momento sin funcionalidad, solo visual
  const mensajes = [
    {
      nombre: "Rita Campos",
      tiempo: "Hace 10 minutos",
      nuevo: true,
      destacada: true,
    },
    {
      nombre: "Laura Márquez",
      tiempo: "Hace 5 horas",
      nuevo: false,
      destacada: false,
    },
    {
      nombre: "Alejandro Taguas",
      tiempo: "Ayer",
      nuevo: false,
      destacada: false,
    },
  ];

  //Proximas citas
  const citas = [
    {
      dia: "Mañana",
      hora: "10:00 PM",
      servicio: "Fuga de agua (Antonio Gómez)",
    },
    {
      dia: "Viernes",
      hora: "16:30 PM",
      servicio: "Revisión instalación (David Aguilar)",
    },
  ];

  return (
    // Contenedor general del panel.
    <div className="min-h-screen bg-[#efeff2]">
      {/* 
        Estructura principal:
        - izquierda: sidebar
        - derecha: contenido del panel
      */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar del profesional*/}
        <aside className="w-full lg:w-[320px] bg-gradient-to-b from-cyan-400 to-emerald-500 text-white flex flex-col justify-between">
          {/* Parte superior del sidebar con el menú */}
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
                    {/* Icono mas texto.. */}
                    <span className="flex items-center gap-4 text-lg font-medium">
                      <Icono className="w-7 h-7" />
                      {item.nombre}
                    </span>

                    {/* Para los mensajes */}
                    {item.badge && (
                      <span className="min-w-6 h-6 px-2 rounded-full bg-white text-rose-500 text-xs font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Tarjeta del plan premium en la zona baja del menú */}
            <div className="mt-20 rounded-[28px] bg-gradient-to-br from-[#bfc6ff] to-[#4f39ff] p-6 shadow-lg">
              <p className="text-base font-semibold leading-7 mb-6">
                Activa el plan PREMIUM y accede a todas las funciones
              </p>

              <button className="w-full rounded-full bg-white px-5 py-3 text-[#4f39ff] font-bold hover:bg-slate-100 transition">
                Mejorar a PREMIUM
              </button>
            </div>
          </div>

          {/* Bloque inferior con el usuario */}
          <div className="border-t border-white/30 bg-white/10 px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100?img=15"
                  alt="Ricardo García"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/70"
                />
                <div>
                  <p className="font-semibold text-lg">Ricardo García</p>
                </div>
              </div>

              <ArrowRightOnRectangleIcon className="w-7 h-7" />
            </div>
          </div>
        </aside>

        {/* Contenido del panel central */}
        <main className="flex-1 flex flex-col">
          {/* Barra superior interna del panel */}
          <header className="bg-[#ececec] px-6 md:px-10 py-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              {/* Buscador */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Buscar ..."
                  className="w-full rounded-full bg-white px-6 py-4 pr-14 text-slate-700 outline-none shadow-sm"
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Iconos y avatar del usuario */}
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
                    src="https://i.pravatar.cc/100?img=15"
                    alt="Ricardo G."
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-700">
                    Ricardo G.
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {/* Zona principal del contenido */}
          <section className="px-6 md:px-10 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Título del panel */}
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3">
                  Tu actividad como profesional
                </h1>
                <p className="text-2xl text-slate-700">
                  Resumen de tus solicitudes, rendimiento y valoraciones
                </p>
              </div>

              {/* Tarjeta de resumen */}
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

                          {/* Texto pequeño en verde o rojo según el dato */}
                          {stat.extra && (
                            <p className={`text-sm font-semibold mt-1 ${stat.extraColor}`}>
                              {stat.extra}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Mensajes recientes */}
              <section className="bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-6 mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-emerald-600">
                    Mensajes recientes
                  </h2>

                  {/* Botón decorativo solo..*/}
                  <button className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold">
                    ...
                  </button>
                </div>

                <div className="space-y-4">
                  {mensajes.map((mensaje) => (
                    <div
                      key={`${mensaje.nombre}-${mensaje.tiempo}`}
                      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl px-4 py-3 ${
                        mensaje.destacada ? "bg-[#efe7d7]" : "bg-[#f8f8f8]"
                      }`}
                    >
                      {/* Avatar de la parte izquierda*/}
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?u=${mensaje.nombre}`}
                          alt={mensaje.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <p className="font-medium text-slate-700">
                          {mensaje.nombre}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm text-slate-500">
                          {mensaje.tiempo}
                        </span>

                        {/* Solo para el primer mensaje */}
                        {mensaje.nuevo && (
                          <span className="rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-600">
                            Nuevo
                          </span>
                        )}

                        {/* Simbolos decorativos de internet */}
                        <div className="flex items-center gap-3 text-amber-700 font-semibold">
                          <span>○</span>
                          <span>✎</span>
                          <span>⋮</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mapa para las zonas de trabajo aún por implementar */}
              <section className="bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-4 md:p-6 mb-10">
                {/* Etiqueta superior*/}
                <div className="inline-block rounded-2xl bg-white px-4 py-2 shadow-sm mb-4">
                  <span className="text-xl font-bold text-[#7fa2ef]">
                    Mis zonas de trabajo
                  </span>
                </div>
                <div className="relative h-[420px] overflow-hidden rounded-[26px] border border-slate-200 bg-[#dbe4ec]">
                  {/* Fondo con líneas y carreteras simuladas */}
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{
                      backgroundImage: `
                        linear-gradient(15deg, transparent 47%, rgba(255,255,255,0.75) 48%, rgba(255,255,255,0.75) 52%, transparent 53%),
                        linear-gradient(-22deg, transparent 47%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0.7) 52%, transparent 53%),
                        linear-gradient(90deg, transparent 46%, rgba(245,190,60,0.8) 47%, rgba(245,190,60,0.8) 53%, transparent 54%),
                        linear-gradient(0deg, transparent 48%, rgba(255,255,255,0.65) 49%, rgba(255,255,255,0.65) 51%, transparent 52%),
                        radial-gradient(circle at 20% 80%, rgba(150, 220, 170, 0.45) 0, rgba(150, 220, 170, 0.45) 12%, transparent 13%),
                        radial-gradient(circle at 80% 20%, rgba(150, 220, 170, 0.35) 0, rgba(150, 220, 170, 0.35) 10%, transparent 11%),
                        radial-gradient(circle at 50% 50%, rgba(120, 190, 255, 0.15) 0, rgba(120, 190, 255, 0.15) 20%, transparent 21%)
                      `,
                    }}
                  />

                  {/* Nombre de la ciudad */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-slate-700/70">
                      Sevilla
                    </span>
                  </div>

                  {/* Marcador principal */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center">
                      <MapPinIcon className="w-14 h-14 text-red-500 drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Controles de zoom decorativos */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                    <button className="w-12 h-12 text-2xl font-bold text-slate-600 border-b border-slate-200">
                      +
                    </button>
                    <button className="w-12 h-12 text-2xl font-bold text-slate-600">
                      −
                    </button>
                  </div>

                  {/* Miniatura decorativa inferior izquierda */}
                  <div className="absolute left-4 bottom-4 w-16 h-16 rounded-lg bg-slate-400/70 border border-white/50" />
                </div>
              </section>

              {/* Proximas citas */}
              <section className="max-w-3xl bg-[#f4f4f4] border border-slate-300 rounded-[28px] p-6">
                <h2 className="text-2xl font-bold text-emerald-600 mb-5">
                  Próximas citas
                </h2>

                <div className="space-y-4">
                  {citas.map((cita) => (
                    <div
                      key={`${cita.dia}-${cita.hora}`}
                      className="bg-[#ece6d8] rounded-2xl px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <p className="font-bold text-slate-800 text-lg">
                        {cita.dia}
                      </p>
                      <p className="font-semibold text-slate-700">
                        {cita.hora}
                      </p>
                      <p className="text-slate-600">{cita.servicio}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PanelProfesional;