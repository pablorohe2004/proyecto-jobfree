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
import { useEffect, useState } from "react";

// importamos idioma
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

// importamos el contexto de sesión para mostrar el nombre real y poder cerrar sesión
import { useAuth } from "context/AuthContext";
import API_URL from "api/config";
import { obtenerConteoMensajesNoLeidos } from "api/mensajes";
import { useChatSocket } from "context/ChatSocketContext";

function Sidebar({ tipo, open, setOpen }) {

    const navigate = useNavigate();

    const location = useLocation();

    const { idioma } = useLanguage();

    const { usuario, cerrarSesion } = useAuth();
    const { subscribeToUserQueue } = useChatSocket();
    const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);

    useEffect(() => {
        if (!usuario?.id) {
            setMensajesNoLeidos(0);
            return undefined;
        }

        function cargarConteo() {
            obtenerConteoMensajesNoLeidos()
                .then((data) => setMensajesNoLeidos(Number(data?.total || 0)))
                .catch(() => {});
        }

        cargarConteo();

        return subscribeToUserQueue((evento) => {
            if (
                evento?.tipo === "mensaje.nuevo"
                || evento?.tipo === "mensaje.leido"
                || evento?.tipo === "mensaje.leido.lote"
                || evento?.tipo === "mensaje.recibido"
                || evento?.tipo === "mensaje.recibido.lote"
                || evento?.tipo === "usuario.mensajes.actualizados"
            ) {
                cargarConteo();
            }
        });
    }, [usuario?.id, subscribeToUserQueue]);

    const menuItems =
        tipo === "cliente"
            ? [
                { key: "panelPrincipal", icono: HomeIcon, ruta: "/dashboard/cliente" },
                { key: "buscarServicios", icono: MagnifyingGlassIcon, ruta: "/dashboard/cliente/buscar/servicios" },
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

    /**
     * Cierra la sesión y redirige al inicio.
     */
    function handleCerrarSesion() {
        cerrarSesion();
        navigate("/");
    }

    return (
        <aside
            className={`w-64 h-screen overflow-y-auto bg-gradient-to-b from-green-500 to-emerald-400 text-white flex flex-col justify-between
            fixed left-0 top-0 pt-4 z-50 transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>

            <nav className="flex-1 p-3 space-y-2 mt-4">

                {menuItems.map((item) => {
                    const Icono = item.icono;
                    const esRutaBaseDashboard = item.key === "panelPrincipal";
                    const isActivo = esRutaBaseDashboard
                        ? location.pathname === item.ruta
                        : location.pathname === item.ruta || location.pathname.startsWith(`${item.ruta}/`);
                    const contador = item.key === "mensajes" ? mensajesNoLeidos : 0;

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

                            {contador > 0 && (
                                <span className={`ml-auto flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                    isActivo ? "bg-emerald-100 text-emerald-700" : "bg-white text-emerald-600"
                                }`}>
                                    {contador > 99 ? "99+" : contador}
                                </span>
                            )}

                        </button>
                    );
                })}

            </nav>

            {/* pie del sidebar: nombre del usuario y botón de logout */}
            <div className="p-4 border-t border-white/20 flex items-center justify-between">

                <div className="flex items-center gap-2 overflow-hidden">
                    {usuario?.fotoUrl ? (
                        <img
                            src={usuario.fotoUrl.startsWith("http") ? usuario.fotoUrl : API_URL + usuario.fotoUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white/40"
                        />
                    ) : (
                        <UserCircleIcon className="w-8 h-8 shrink-0" />
                    )}
                    <span className="text-sm font-medium truncate">
                        {usuario?.nombreCompleto ?? "..."}
                    </span>
                </div>

                {/* Botón de cerrar sesión — llama a la función real del contexto */}
                <button
                    onClick={handleCerrarSesion}
                    className="cursor-pointer hover:text-red-200 shrink-0"
                    title={t(idioma, "dashboard.cerrarSesion")}
                    aria-label={t(idioma, "dashboard.cerrarSesion")}>
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
