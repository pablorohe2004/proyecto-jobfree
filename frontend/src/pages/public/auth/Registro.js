import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";

import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// importamos idioma
import { useLanguage } from "context/LanguageContext";
import { t } from "i18n";

// importamos la función de registro del contexto de sesión
import { useAuth } from "context/AuthContext";
import API_URL from "api/config";
import { iniciarOAuth } from "api/auth";

// Prefijos telefónicos con bandera
const PREFIJOS = [
  { codigo: "+34",  bandera: "🇪🇸" },
  { codigo: "+351", bandera: "🇵🇹" },
  { codigo: "+33",  bandera: "🇫🇷" },
  { codigo: "+49",  bandera: "🇩🇪" },
  { codigo: "+44",  bandera: "🇬🇧" },
  { codigo: "+39",  bandera: "🇮🇹" },
  { codigo: "+1",   bandera: "🇺🇸" },
];

// Reglas de validación de contraseña
function validarPassword(pw) {
  return {
    longitud:  pw.length >= 8,
    numero:    /\d/.test(pw),
    mayuscula: /[A-Z]/.test(pw),
  };
}

function Registro() {

  const navigate = useNavigate();
  const { registrar } = useAuth();
  const { idioma } = useLanguage();

  // controla si el usuario se registra como profesional o como cliente
  const [esProfesional, setEsProfesional] = useState(false);

  // controla si se muestra o se oculta la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // controla si se muestra o se oculta la confirmación de contraseña
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // estado de carga mientras procesamos el registro
  const [cargando, setCargando] = useState(false);

  // mensaje de error para mostrar si algo falla
  const [error, setError] = useState("");

  // campos del formulario como estado controlado
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    prefijo: "+34",
    telefono: "",
    ciudad: "",
    direccion: "",
    password: "",
    confirmarPassword: "",
  });

  // validación de contraseña en tiempo real
  const reglas = validarPassword(form.password);
  const passwordValida = reglas.longitud && reglas.numero && reglas.mayuscula;

  // validación visual de confirmación
  const passwordsCoinciden   = form.confirmarPassword.length > 0 && form.password === form.confirmarPassword;
  const passwordsNoCoinciden = form.confirmarPassword.length > 0 && form.password !== form.confirmarPassword;

  // validación de teléfono: solo dígitos, entre 6 y 15 caracteres
  const telefonoValido = /^\d{6,15}$/.test(form.telefono);
  const telefonoTocado = form.telefono.length > 0;

  /**
   * Actualiza el campo correspondiente del formulario cuando el usuario escribe.
   * Para el teléfono, solo permite dígitos.
   */
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "telefono") {
      setForm({ ...form, telefono: value.replace(/\D/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  /**
   * Se ejecuta al pulsar "Crear cuenta".
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!passwordValida) {
      setError("La contraseña no cumple los requisitos mínimos");
      return;
    }

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!telefonoValido) {
      setError("Introduce un número de teléfono válido (6-15 dígitos)");
      return;
    }

    setError("");
    setCargando(true);

    try {
      const usuario = await registrar(
        {
          nombre:    form.nombre,
          apellidos: form.apellidos,
          email:     form.email,
          telefono:  form.prefijo + form.telefono,
          ciudad:    form.ciudad,
          direccion: form.direccion,
          password:  form.password,
        },
        esProfesional
      );

      if (usuario.rol?.toUpperCase() === "PROFESIONAL") {
        navigate("/dashboard/profesional");
      } else {
        navigate("/dashboard/cliente");
      }

    } catch (err) {
      console.error("Error en registro:", err.message);
      setError(err.message || t(idioma, "errorRegistro"));
    } finally {
      setCargando(false);
    }
  }

  // Solo bloqueamos mientras carga o cuando las contraseñas no coinciden (el resto lo valida handleSubmit)
  const formInvalido = cargando || passwordsNoCoinciden;

  // proveedor OAuth esperando confirmación de rol (null | 'google' | 'microsoft')
  const [proveedorOAuth, setProveedorOAuth] = useState(null);

  async function confirmarOAuth(rol) {
    await iniciarOAuth(rol); // guarda el rol en la sesión del backend
    window.location.href = `${API_URL}/oauth2/authorization/${proveedorOAuth}`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      {/* Botón para volver a inicio */}
      <div className="w-full px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {t(idioma, "auth.general.volver")}
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center py-8">

        {/* Tarjeta del registro */}
        <div className="bg-gray-50 text-gray-500 max-w-md w-full mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow mb-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-3">
            <img src={logo} alt="JobFree" className="h-16" />
          </div>

          {/* Título */}
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900">
            {t(idioma, "auth.registro.titulo")}
          </h2>

          {/* Switch Profesional / Usuario */}
          <div className="flex justify-center mb-2">
            <div className="flex bg-gray-200 p-1 rounded-full shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setEsProfesional(false)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  !esProfesional
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {t(idioma, "auth.registro.usuario")}
              </button>
              <button
                type="button"
                onClick={() => setEsProfesional(true)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  esProfesional
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {t(idioma, "auth.registro.profesional")}
              </button>
            </div>
          </div>

          {/* Descripción dinámica del tipo de cuenta */}
          <p className="text-center text-xs text-gray-400 mb-3">
            {esProfesional
              ? "Ofreces servicios en la plataforma"
              : "Contratas servicios en la plataforma"}
          </p>

          <hr className="border-gray-300/60 mb-4" />

          {/* Formulario */}
          <form onSubmit={handleSubmit}>

            {/* Nombre + Apellidos */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="nombre" className="block text-xs font-medium text-gray-700 mb-1">
                  {t(idioma, "auth.registro.nombre")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label htmlFor="apellidos" className="block text-xs font-medium text-gray-700 mb-1">
                  {t(idioma, "auth.registro.apellidos")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                {t(idioma, "auth.registro.email")}<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            {/* Teléfono con prefijo */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t(idioma, "auth.registro.telefono")}<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="prefijo"
                  value={form.prefijo}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 cursor-pointer">
                  {PREFIJOS.map(p => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.bandera} {p.codigo}
                    </option>
                  ))}
                </select>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  inputMode="numeric"
                  value={form.telefono}
                  onChange={handleChange}
                  className={`w-full bg-white border rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    telefonoTocado && !telefonoValido
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required />
              </div>
              {telefonoTocado && !telefonoValido && (
                <p className="text-xs text-red-500 mt-1">Solo números, entre 6 y 15 dígitos</p>
              )}
            </div>

            {/* Ciudad + Dirección */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="ciudad" className="block text-xs font-medium text-gray-700 mb-1">
                  {t(idioma, "auth.registro.ciudad")}
                </label>
                <input
                  id="ciudad"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="direccion" className="block text-xs font-medium text-gray-700 mb-1">
                  {t(idioma, "auth.registro.direccion")}
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-1">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                {t(idioma, "auth.registro.password")}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label={t(idioma, mostrarPassword ? "auth.registro.ocultarPassword" : "auth.registro.mostrarPassword")}>
                  {mostrarPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Indicadores de fuerza de contraseña */}
            {form.password.length > 0 && (
              <ul className="flex gap-3 text-xs mb-3 mt-1.5">
                <li className={reglas.longitud ? "text-green-600" : "text-gray-400"}>
                  {reglas.longitud ? "✓" : "○"} 8 caracteres
                </li>
                <li className={reglas.numero ? "text-green-600" : "text-gray-400"}>
                  {reglas.numero ? "✓" : "○"} 1 número
                </li>
                <li className={reglas.mayuscula ? "text-green-600" : "text-gray-400"}>
                  {reglas.mayuscula ? "✓" : "○"} 1 mayúscula
                </li>
              </ul>
            )}

            {/* Confirmar contraseña */}
            <div className="mb-4">
              <label htmlFor="confirmarPassword" className="block text-xs font-medium text-gray-700 mb-1">
                {t(idioma, "auth.registro.confirmarPassword")}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type={mostrarConfirmar ? "text" : "password"}
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  className={`w-full bg-white border rounded-full py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    passwordsCoinciden
                      ? "border-green-400 focus:ring-green-400"
                      : passwordsNoCoinciden
                      ? "border-red-400   focus:ring-red-400"
                      : "border-gray-300  focus:ring-blue-500"
                  }`}
                  required />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label={t(idioma, mostrarConfirmar ? "auth.registro.ocultarPassword" : "auth.registro.mostrarPassword")}>
                  {mostrarConfirmar ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {passwordsCoinciden && (
                <p className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> Las contraseñas coinciden
                </p>
              )}
              {passwordsNoCoinciden && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <XCircleIcon className="w-3.5 h-3.5" /> Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Error general */}
            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={formInvalido}
              className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 disabled:opacity-60 transition text-sm font-medium">
              {cargando
                ? t(idioma, "cargandoSesion")
                : t(idioma, "auth.registro.boton")}
            </button>

          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-300/60" />
            <span className="text-xs text-gray-400">{t(idioma, "auth.general.o")}</span>
            <hr className="flex-1 border-gray-300/60" />
          </div>

          <button
            type="button"
            onClick={() => setProveedorOAuth("google")}
            className="w-full flex items-center gap-2 justify-center mb-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition text-sm">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {t(idioma, "auth.social.google")}
          </button>

          <button
            type="button"
            onClick={() => setProveedorOAuth("microsoft")}
            className="w-full flex items-center gap-2 justify-center bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition text-sm">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {t(idioma, "auth.social.microsoft")}
          </button>

        </div>
      </div>

      {/* Modal de elección de rol */}
      {proveedorOAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">

            {/* Icono del proveedor */}
            <div className="flex justify-center mb-4">
              {proveedorOAuth === "google"
                ? <img className="h-8 w-8" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="Google" />
                : <img className="h-8" src="https://img.icons8.com/color/48/microsoft.png" alt="Microsoft" />
              }
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              ¿Cómo quieres usar JobFree?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Elige tu rol para continuar con {proveedorOAuth === "google" ? "Google" : "Microsoft"}
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => confirmarOAuth("CLIENTE")}
                className="group w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left">
                <span className="text-2xl">🔍</span>
                <span>
                  <span className="block font-semibold text-gray-800 group-hover:text-blue-600">Soy Cliente</span>
                  <span className="block text-xs text-gray-400">Quiero contratar servicios</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => confirmarOAuth("PROFESIONAL")}
                className="group w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition text-left">
                <span className="text-2xl">🛠️</span>
                <span>
                  <span className="block font-semibold text-gray-800 group-hover:text-emerald-600">Soy Profesional</span>
                  <span className="block text-xs text-gray-400">Quiero ofrecer mis servicios</span>
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setProveedorOAuth(null)}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
}

export default Registro;
