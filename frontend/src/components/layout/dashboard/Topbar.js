import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

function Topbar({ setOpen }) {
    // controla apertura del menú de usuario
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // navegación entre rutas
    const navigate = useNavigate();

    return (
        <header className="h-16 w-full bg-gray-100 border-b flex items-center px-6">
            {/* botón menú móvil */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden mr-4" >
                <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>

            {/* buscador */}
            <div className="flex-1 flex justify-start">
                <div className="relative w-72 ml-2">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />
                </div>
            </div>

            {/* zona derecha */}
            <div className="flex items-center gap-6">
                {/* icono notificaciones */}
                <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />

                {/* usuario */}
                <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <UserCircleIcon className="w-9 h-9 text-gray-600" />
                    </button>

                    {/* menú desplegable */}
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden z-20">
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                Perfil
                            </button>

                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                Configuración
                            </button>

                            {/* cerrar sesión y volver a inicio */}
                            <button
                                onClick={() => navigate("/")}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500">
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Topbar;
