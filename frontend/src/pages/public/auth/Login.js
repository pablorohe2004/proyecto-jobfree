import { Link } from "react-router-dom";
import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// importamos idioma
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

function Login() {

  // obtenemos idioma actual
  const { idioma } = useLanguage();

  return (
    // Contenedor principal que centra el login en la pantalla
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      {/* Botón para volver a inicio */}
      <div className="w-full px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {t(idioma, "auth.general.volver")}
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
            {t(idioma, "auth.login.titulo")}
          </h2>

          {/* Separador */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* Formulario de login */}
          <form>

            {/* Campo email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t(idioma, "auth.login.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jobfree@gmail.com"
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t(idioma, "auth.login.password")}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t(idioma, "auth.login.password")}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            {/* Checkbox Recordar datos */}
            <label htmlFor="recordar" className="flex items-center gap-2 py-2">
              <input id="recordar" name="recordar" type="checkbox" className="accent-blue-600" />
              {t(idioma, "auth.general.recordar")}
            </label>

            {/* Botón Entrar */}
            <button type="submit" className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700">
              {t(idioma, "auth.login.boton")}
            </button>

          </form>

          {/* Link para recuperar contraseña */}
          <div className="text-center text-sm">
            <Link to="/recuperar-password" className="text-blue-600">
              {t(idioma, "auth.general.olvidado")}
            </Link>
          </div>

          {/* Link para registrarse */}
          <p className="text-center mt-2">
            {t(idioma, "auth.general.noCuenta")}{" "}
            <Link to="/registro" className="text-blue-600">
              {t(idioma, "auth.general.alta")}
            </Link>
          </p>

          {/* Línea separadora */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
            <span>{t(idioma, "auth.general.o")}</span>
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* Botón Google */}
          <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {t(idioma, "auth.social.google")}
          </button>

          {/* Botón Microsoft */}
          <button className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {t(idioma, "auth.social.microsoft")}
          </button>

          {/* Botón Apple */}
          <button type="button" className="w-full flex items-center gap-2 justify-center mt-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img className="h-4 w-4" src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="apple" />
            {t(idioma, "auth.social.apple")}
          </button>

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Login;
