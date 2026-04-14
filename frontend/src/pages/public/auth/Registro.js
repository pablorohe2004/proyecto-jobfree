import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import SimpleFooter from "../../../components/layout/public/SimpleFooter";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

function Registro() {

  // controla si el usuario se registra como profesional o como cliente
  const [esProfesional, setEsProfesional] = useState(false);

  // controla si se muestra o se oculta la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // controla si se muestra o se oculta la confirmación de contraseña
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const { idioma } = useLanguage();

  return (
    // Contenedor principal que centra el login en la pantalla
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      {/* Botón para volver a inicio */}
      <div className="w-full px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {t(idioma, "volver")}
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center py-10">


        {/* Tarjeta del login */}
        <div className="bg-gray-50 text-gray-500 max-w-md w-full mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow mb-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="JobFree" className="h-24" />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            {t(idioma, "crearCuenta")}
          </h2>

          {/* Separador */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* switch Profesional/Usuario */}
          <div className="flex justify-end mb-4">
            <div className="flex bg-zinc-300 p-1.5 rounded-full">

              <button
                onClick={() => setEsProfesional(true)} // cambia a mensual
                className={`px-4 py-2 rounded-full text-xs transition ${esProfesional ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
                {t(idioma, "profesional")}
              </button>

              <button
                onClick={() => setEsProfesional(false)} // cambia a anual
                className={`px-4 py-2 rounded-full text-xs transition ${!esProfesional ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
                {t(idioma, "usuario")}
              </button>

            </div>

          </div>
          {/* Formulario de login */}
          <form>

            {/* Campo nombre y Apellidos */}
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "nombre")}<span className="text-red-500">*</span></label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            {/* Campo email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "email")}
                <span className="text-red-500">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jobfree@gmail.com"
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            {/* Campo teléfono */}
            <div className="mb-4">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "telefono")}<span className="text-red-500">*</span></label>
              <div className="flex">

                {/* Select prefijo */}
                <select name="prefijo" className="bg-gray-100 border border-gray-300 rounded-l-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>

                {/* Input teléfono */}
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="600 123 456"
                  className="w-full bg-white border border-gray-300 border-l-0 rounded-r-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />

              </div>
            </div>

            {/* Campo contraseña */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "password")}
                <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder={t(idioma, "password")}
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  title={t(idioma, mostrarPassword ? "ocultarPassword" : "mostrarPassword")}
                  aria-label={t(idioma, mostrarPassword ? "ocultarPassword" : "mostrarPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer">
                  {mostrarPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>


            {/* Campo confirmar contraseña */}
            <div className="mb-4">
              <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "confirmarPassword")}<span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type={mostrarConfirmar ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder={t(idioma, "repetirPassword")}
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  title={t(idioma, mostrarConfirmar ? "ocultarPassword" : "mostrarPassword")}
                  aria-label={t(idioma, mostrarConfirmar ? "ocultarPassword" : "mostrarPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer">
                  {mostrarConfirmar ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Términos y Política de privacidad */}
            <label htmlFor="terminos" className="flex items-center gap-2 py-2">
              <input id="terminos" name="terminos" type="checkbox" className="accent-blue-600" />
              {t(idioma, "aceptarTerminos")}
            </label>

            {/* Botón Crear cuenta */}
            <button type="submit" className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700">
              {t(idioma, "crearCuentaBoton")}
            </button>

          </form>

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Registro;
