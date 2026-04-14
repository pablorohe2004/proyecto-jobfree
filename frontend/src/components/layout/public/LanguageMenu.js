import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import esFlag from "../../../assets/images/flags/es.svg";
import gbFlag from "../../../assets/images/flags/gb.svg";

// componente para cambiar el idioma (ES / EN)
function LanguageMenu({ variant = "dark" }) {

  // estado que controla si el dropdown está abierto o cerrado
  const [open, setOpen] = useState(false);

  // obtenemos el idioma actual y la función para cambiarlo desde el contexto
  const { idioma, cambiarIdioma } = useLanguage();

  // referencia al componente para detectar clicks fuera
  const ref = useRef();

  // efecto para cerrar el menú si hacemos click fuera
  useEffect(() => {
    function handleClick(e) {
      // si el click no es dentro del componente, cerrar dropdown
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    // añadimos el evento al documento
    document.addEventListener("mousedown", handleClick);

    // limpiamos el evento cuando el componente se desmonta
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // definimos el idioma actual que se muestra
  const current = idioma === "en"
    ? { label: "EN", flag: gbFlag }
    : { label: "ES", flag: esFlag };

  // estilos dependiendo de dónde se use (navbar o topbar)
  const styles =
    variant === "light"
      ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
      : "text-white bg-white/10 hover:bg-white/20";

  // color del icono según el fondo
  const iconColor = variant === "light" ? "text-gray-700" : "";

  return (
    // contenedor relativo para posicionar el dropdown correctamente
    <div className="relative" ref={ref}>

      {/* BOTÓN PRINCIPAL */}
      {/* muestra el idioma actual y abre/cierra el menú */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition text-sm ${styles}`}
      >
        {/* bandera del idioma */}
        <img
          src={current.flag}
          className="w-5 h-3 rounded-sm"
          alt="Idioma actual"
        />

        {/* texto corto (ES / EN) */}
        <span>{current.label}</span>

        {/* icono de flecha que rota al abrir */}
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${iconColor} ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-auto min-w-[90px] bg-white rounded-md shadow-md overflow-hidden z-50">

          {idioma === "es" && (
            <button
              onClick={() => {
                cambiarIdioma("en"); // cambiamos idioma
                setOpen(false); // cerramos menú
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <img src={gbFlag} className="w-4 h-3" alt="Inglés" />
              EN
            </button>
          )}

          {idioma === "en" && (
            <button
              onClick={() => {
                cambiarIdioma("es");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <img src={esFlag} className="w-4 h-3" alt="Español" />
              ES
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default LanguageMenu;
