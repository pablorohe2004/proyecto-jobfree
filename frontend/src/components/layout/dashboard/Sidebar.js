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

import { useNavigate, useLocation } from "react-router-dom";

// importamos idioma
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

function Sidebar({ tipo, open, setOpen }) {

    const navigate = useNavigate();
    const location = useLocation();

    // obtenemos idioma actual
    const { idioma } = useLanguage();

    // menú según tipo de usuario
    const menuItems =
        tipo === "cliente"
            ? [
                { key: "panelPrincipal", icono: HomeIcon, ruta: "/dashboard/cliente" },
                { key: "buscarServicios", icono: MagnifyingGlassIcon, ruta: "/servicios" },
                { key: "reservas", icono: CalendarDaysIcon, ruta: "/dashboard/cliente/reservas" },
                { key: "mensajes", icono: ChatBubbleLeftRightIcon, ruta: "/dashboard/cliente/mensajes" },
                { key: "resenas", icono: StarIcon, ruta: "/dashboard/cliente/resenas" },
                { key: "facturas", icono: CreditCardIcon, ruta: "/dashboard/cliente/facturas" },
                { key: "favoritos", icono: HeartIcon, ruta: "/dashboard/cliente/favoritos" },
                { key: "configuracion", icono: Cog6ToothIcon, ruta: "/dashboard/cliente/configuracion" },
            ]
            : [
                { key: "panelPrincipal", icono: Squares2X2Icon, ruta: "/dashboard/profesional" },
                { key: "solicitudes", icono: ClipboardDocumentListIcon, ruta: "/dashboard/profesional/solicitudes" },
                { key: "mensajes", icono: ChatBubbleLeftRightIcon, ruta: "/dashboard/profesional/mensajes" },
                { key: "miCalendario", icono: CalendarDaysIcon, ruta: "/dashboard/profesional/calendario" },
                { key: "misServicios", icono: WrenchScrewdriverIcon, ruta: "/dashboard/profesional/servicios" },
                { key: "resenas", icono: StarIcon, ruta: "/dashboard/profesional/resenas" },
                { key: "miPlan", icono: CreditCardIcon, ruta: "/dashboard/profesional/plan" },
                { key: "configuracion", icono: Cog6ToothIcon, ruta: "/dashboard/profesional/configuracion" },
            ];

    return (
        <aside
            className={`w-64 h-screen overflow-y-auto bg-gradient-to-b from-green-500 to-emerald-400 text-white flex flex-col justify-between
            fixed left-0 top-0 pt-4 z-50 transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>

            <nav className="flex-1 p-3 space-y-2 mt-4">

                {menuItems.map((item) => {
                    const Icono = item.icono;
                    const isActivo = location.pathname === item.ruta;

                    return (
                        <button
                            key={item.key}
                            onClick={() => {
                                setOpen(false);
                                navigate(item.ruta);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActivo
                                ? "bg-white text-emerald-600"
                                : "hover:bg-white/30"
                                }`}>

                            <Icono className="w-5 h-5" />

                            {t(idioma, `dashboard.${item.key}`)}

                        </button>
                    );
                })}

            </nav>

            <div className="p-4 border-t border-white/20 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-8 h-8" />
                    <span className="text-sm font-medium">
                        {tipo === "cliente" ? "Alejandro" : "Ricardo"}
                    </span>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:text-red-200"
                    aria-label="Cerrar sesión">

                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
