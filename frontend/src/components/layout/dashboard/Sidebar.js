import {
    HomeIcon,
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    StarIcon,
    CreditCardIcon,
    HeartIcon,
    Cog6ToothIcon,
    Squares2X2Icon,
    ClipboardDocumentListIcon,
    WrenchScrewdriverIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ tipo, open, setOpen }) {
    const navigate = useNavigate();

    // estado que guarda qué opción del menú está seleccionada
    const [activo, setActivo] = useState(
        tipo === "cliente" ? "Inicio" : "Panel principal"
    );

    // array de opciones del menú que cambia según el tipo de usuario
    const menuItems =
        tipo === "cliente"
            ? [
                { nombre: "Inicio", icono: HomeIcon },
                { nombre: "Buscar servicios", icono: MagnifyingGlassIcon },
                { nombre: "Reservas", icono: CalendarDaysIcon },
                { nombre: "Mensajes", icono: ChatBubbleLeftRightIcon },
                { nombre: "Reseñas", icono: StarIcon },
                { nombre: "Facturas", icono: CreditCardIcon },
                { nombre: "Favoritos", icono: HeartIcon },
                { nombre: "Configuración", icono: Cog6ToothIcon },
            ]
            : [
                { nombre: "Panel principal", icono: Squares2X2Icon },
                { nombre: "Solicitudes", icono: ClipboardDocumentListIcon },
                { nombre: "Mensajes", icono: ChatBubbleLeftRightIcon },
                { nombre: "Mi calendario", icono: CalendarDaysIcon },
                { nombre: "Mis servicios", icono: WrenchScrewdriverIcon },
                { nombre: "Reseñas", icono: StarIcon },
                { nombre: "Mi plan", icono: CreditCardIcon },
                { nombre: "Configuración", icono: Cog6ToothIcon },
            ];

    return (
        <aside
            className={`w-64 h-screen overflow-y-auto bg-gradient-to-b from-green-500 to-emerald-400 text-white flex flex-col justify-between
            fixed left-0 top-0 pt-4 z-50 transform transition-transform duration-300
            ${open
                    ? "translate-x-0"
                    : "-translate-x-full md:translate-x-0"
                }
        `}>
            {/* menú lateral */}
            <nav className="flex-1 p-3 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const Icono = item.icono;
                    const isActivo = activo === item.nombre;

                    return (
                        <button
                            key={item.nombre}
                            // al hacer click cambia la opción activa
                            onClick={() => {
                                setActivo(item.nombre);
                                setOpen(false);
                            }}
                            // estilos distintos si está seleccionado
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActivo
                                ? "bg-white text-emerald-600"
                                : "hover:bg-white/30"
                                }`} >
                            <Icono className="w-5 h-5" />
                            {item.nombre}
                        </button>
                    );
                })}
            </nav>

            {/* zona inferior, usuario y logout */}
            <div className="p-4 border-t border-white/20 flex items-center justify-between">
                {/* información del usuario */}
                <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-8 h-8" />
                    <span className="text-sm font-medium">
                        {tipo === "cliente" ? "Alejandro" : "Ricardo"}
                    </span>
                </div>

                {/* botón para cerrar sesión */}
                <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:text-red-200">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
