import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

function Menu() {

  // estado para abrir ocerrar el menú hamburguesa en móvil
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* menú principal para ordenador */}
      <nav className="hidden md:flex justify-center items-center gap-8 py-3 bg-gradient-to-r from-green-500 to-emerald-400">

        {/* enlace a la página de inicio */}
        <Link to="/" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          Inicio
        </Link>

        {/* menú desplegable de servicios */}
        <div className="relative group">

          {/* botón que muestra el dropdown */}
          <button className="flex items-center gap-1 text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition cursor-pointer">
            Servicios
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          {/* lista de opciones que aparece al pasar el ratón */}
          <div className="absolute left-0 top-full pt-2 z-50 hidden group-hover:block w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Mantenimiento
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Reparaciones
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Cuidado personal
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Mascotas
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Clases
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Urgencias
            </Link>

            <Link to="/servicios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Otros
            </Link>

          </div>

        </div>

        {/* resto de enlaces del menú */}
        <Link to="/conocenos" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          Conócenos
        </Link>

        <Link to="/para-profesionales" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          Para profesionales
        </Link>

        <Link to="/contacto" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          Contacto
        </Link>

      </nav>


      {/* versión del menú para móvil */}
      <div className="md:hidden bg-gradient-to-r from-green-500 to-emerald-400">

        {/* botón hamburguesa */}
        <div className="flex justify-between items-center px-4 py-3">

          <button onClick={() => setOpen(!open)} className="text-white cursor-pointer">
            {open ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

        </div>

        {/* enlaces que aparecen al abrir el menú */}
        {open && (

          <div className="flex flex-col gap-2 px-4 pb-4 text-white transition-all duration-200">

            <Link to="/" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              Inicio
            </Link>

            <Link to="/servicios" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              Servicios
            </Link>

            <Link to="/conocenos" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              Conócenos
            </Link>

            <Link to="/para-profesionales" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              Para profesionales
            </Link>

            <Link to="/contacto" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              Contacto
            </Link>

          </div>

        )}

      </div>
    </>
  );
}

export default Menu;
