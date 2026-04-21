import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";
import API_URL from "api/config";

import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

import { useAuth } from "context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { iniciarSesion } = useAuth();
  const { idioma } = useLanguage();

  const errorDeUrl = searchParams.get("error") === "cuenta_existente"
    ? "Ya tienes una cuenta con ese correo. Inicia sesión normalmente."
    : null;

  // valores del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // estado de carga mientras se procesa el login
  const [cargando, setCargando] = useState(false);

  // mensaje de error para mostrar al usuario si algo falla
  const [error, setError] = useState("");

  // controla si se muestra o se oculta la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  /**
   * Se ejecuta cuando el usuario pulsa "Entrar".
   * Llama al backend, guarda el token y redirige según el rol.
   */
  async function handleSubmit(e) {
    // Evitamos que el navegador recargue la página al enviar el formulario
    e.preventDefault();

    setError("");
    setCargando(true);

    try {
      // iniciarSesion llama a /auth/login, luego a /auth/me y guarda todo en el contexto
      const usuario = await iniciarSesion(email, password);

      // Redirigimos según el rol que nos devuelve el backend
      if (usuario.rol?.toUpperCase() === "PROFESIONAL") {
        navigate("/dashboard/profesional");
      } else {
        navigate("/dashboard/cliente");
      }

    } catch (err) {
      // mostramos error
      setError(t(idioma, "errorLogin"));
    } finally {
      setCargando(false);
    }
  }

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
          <form onSubmit={handleSubmit}>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t(idioma, "auth.login.password")}
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={t(idioma, mostrarPassword ? "auth.login.ocultarPassword" : "auth.login.mostrarPassword")}
                >
                  {mostrarPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Recordar datos */}
            <label htmlFor="recordar" className="flex items-center gap-2 py-2">
              <input id="recordar" name="recordar" type="checkbox" className="accent-blue-600" />
              {t(idioma, "auth.general.recordar")}
            </label>

            {errorDeUrl && (
              <p className="text-red-600 text-sm mb-3 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorDeUrl}
              </p>
            )}

            {/* Mensaje de error */}
            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            {/* Botón Entrar */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700 disabled:opacity-60">
              {cargando
                ? t(idioma, "cargandoSesion")
                : t(idioma, "auth.login.boton")}
            </button>

          </form>

          {/* Recuperar contraseña */}
          <div className="text-center text-sm">
            <Link to="/recuperar-password" className="text-blue-600">
              {t(idioma, "auth.general.olvidado")}
            </Link>
          </div>

          {/* Registro */}
          <p className="text-center mt-2">
            {t(idioma, "auth.general.noCuenta")}{" "}
            <Link to="/registro" className="text-blue-600">
              {t(idioma, "auth.general.alta")}
            </Link>
          </p>

          {/* Separador */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
            <span>{t(idioma, "auth.general.o")}</span>
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* Botones sociales — login directo, sin selección de rol */}
          <a
            href={`${API_URL}/oauth2/authorization/google`}
            className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {t(idioma, "auth.social.google")}
          </a>

          <a
            href={`${API_URL}/oauth2/authorization/microsoft`}
            className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {t(idioma, "auth.social.microsoft")}
          </a>

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Login;
