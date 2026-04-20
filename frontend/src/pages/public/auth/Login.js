import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import SimpleFooter from "../../../components/layout/public/SimpleFooter";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// importamos idioma
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

// importamos la función de login del contexto de sesión
import { useAuth } from "../../../context/AuthContext";

function Login() {

  // hook de navegación para redirigir después del login
  const navigate = useNavigate();

  // función de login del contexto global
  const { iniciarSesion } = useAuth();

  // obtenemos idioma actual
  const { idioma } = useLanguage();

  // valores del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // estado de carga mientras se procesa el login
  const [cargando, setCargando] = useState(false);

  // mensaje de error para mostrar al usuario si algo falla
  const [error, setError] = useState("");

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
      // (el rol viene como label: "Cliente", "Profesional", "Administrador")
      if (usuario.rol === "Profesional") {
        navigate("/dashboard/profesional");
      } else {
        // Clientes y admins van al dashboard de cliente por defecto
        navigate("/dashboard/cliente");
      }

    } catch (err) {
      // Si el login falla (contraseña incorrecta, usuario no encontrado, etc.)
      // mostramos el mensaje de error debajo del formulario
      setError(t(idioma, "errorLogin"));
    } finally {
      // Siempre quitamos el estado de carga, haya ido bien o mal
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
            {t(idioma, "loginTitulo")}
          </h2>

          {/* Separador */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* Formulario de login */}
          <form onSubmit={handleSubmit}>

            {/* Campo email — controlado por estado para poder leerlo en el submit */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t(idioma, "email")}
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
                required />
            </div>

            {/* Campo contraseña — igual, controlado por estado */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t(idioma, "password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t(idioma, "password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            {/* Checkbox Recordar datos */}
            <label htmlFor="recordar" className="flex items-center gap-2 py-2">
              <input id="recordar" name="recordar" type="checkbox" className="accent-blue-600" />
              {t(idioma, "recordar")}
            </label>

            {/* Mensaje de error — solo aparece si algo ha ido mal */}
            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            {/* Botón Entrar — se deshabilita mientras carga para evitar doble envío */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
              {cargando ? t(idioma, "cargandoSesion") : t(idioma, "loginBoton")}
            </button>

          </form>

          {/* Link para recuperar contraseña */}
          <div className="text-center text-sm">
            <Link to="/recuperar-password" className="text-blue-600">
              {t(idioma, "olvidado")}
            </Link>
          </div>

          {/* Link para registrarse */}
          <p className="text-center mt-2">
            {t(idioma, "noCuenta")}{" "}
            <Link to="/registro" className="text-blue-600">
              {t(idioma, "alta")}
            </Link>
          </p>

          {/* Línea separadora */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
            <span>{t(idioma, "o")}</span>
            <hr className="flex-1 border-gray-400/50" />
          </div>

          {/* Botón Google */}
          <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {t(idioma, "google")}
          </button>

          {/* Botón Microsoft */}
          <button className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {t(idioma, "microsoft")}
          </button>

          {/* Botón Apple */}
          <button type="button" className="w-full flex items-center gap-2 justify-center mt-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100">
            <img className="h-4 w-4" src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="apple" />
            {t(idioma, "apple")}
          </button>

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Login;
