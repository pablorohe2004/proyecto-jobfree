import { useState, useEffect, useRef } from "react";
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "context/AuthContext";
import { actualizarMiUsuario, subirFotoPerfil } from "api/usuario";
import { obtenerMiPerfil, actualizarMiPerfil } from "api/profesional";
import API_URL from "api/config";

// ── Validadores ───────────────────────────────────────────────────────────
function validarPassword(pw) {
  return {
    longitud:  pw.length >= 8,
    numero:    /\d/.test(pw),
    mayuscula: /[A-Z]/.test(pw),
  };
}

function telefonoValido(v) {
  return !v || /^\+?[\d\s\-]{6,20}$/.test(v);
}

// ── Banner reutilizable ───────────────────────────────────────────────────
function Banner({ tipo, texto }) {
  if (!texto) return null;
  const esError = tipo === "error";
  return (
    <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${
      esError
        ? "bg-red-50 border border-red-200 text-red-600"
        : "bg-emerald-50 border border-emerald-200 text-emerald-700"
    }`}>
      {texto}
    </div>
  );
}

// ── Input con icono e inline-error ────────────────────────────────────────
function Campo({ label, name, value, onChange, onBlur, type = "text", placeholder = "", icono, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icono && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border rounded-xl py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-300 focus:ring-red-400"
              : "border-gray-200 focus:ring-emerald-500 focus:border-transparent"
          } ${icono ? "pl-10 pr-4" : "px-4"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
function Configuracion() {
  const { cargarUsuarioActual } = useAuth();
  const fileInputRef = useRef();

  const [esProfesional, setEsProfesional] = useState(false);
  const [fotoUrlActual, setFotoUrlActual] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  // ── Sección 1: Foto + Datos personales ───────────────────────────────
  const [emailActual, setEmailActual] = useState("");
  const [form, setForm] = useState({
    nombre: "", apellidos: "",
    telefono: "", ciudad: "", direccion: "",
  });
  const [tocados, setTocados] = useState({});
  const [preview, setPreview] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [guardandoPersonal, setGuardandoPersonal] = useState(false);
  const [exitoPersonal, setExitoPersonal] = useState(false);
  const [errorPersonal, setErrorPersonal] = useState("");

  // ── Sección 2: Contraseña ─────────────────────────────────────────────
  const [pw, setPw] = useState({ nueva: "", confirmar: "" });
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [guardandoPw, setGuardandoPw] = useState(false);
  const [exitoPw, setExitoPw] = useState(false);
  const [errorPw, setErrorPw] = useState("");

  // ── Sección 3: Perfil profesional ────────────────────────────────────
  const [perfilPro, setPerfilPro] = useState(null);
  const [formPro, setFormPro] = useState({
    descripcion: "", experiencia: 0, codigoPostal: "", nombreEmpresa: "", cif: "",
  });
  const [guardandoPro, setGuardandoPro] = useState(false);
  const [exitoPro, setExitoPro] = useState(false);
  const [errorPro, setErrorPro] = useState("");

  // ── Carga inicial ─────────────────────────────────────────────────────
  useEffect(() => {
    cargarUsuarioActual()
      .then(u => {
        setEmailActual(u.email || "");
        setForm({
          nombre: u.nombre || "",
          apellidos: u.apellidos || "",
          telefono: u.telefono || "",
          ciudad: u.ciudad || "",
          direccion: u.direccion || "",
        });
        setFotoUrlActual(u.fotoUrl || null);

        const esPro = u.rol?.toLowerCase() === "profesional";
        setEsProfesional(esPro);

        if (esPro) {
          obtenerMiPerfil()
            .then(p => {
              setPerfilPro(p);
              setFormPro({
                descripcion: p.descripcion || "",
                experiencia: p.experiencia ?? 0,
                codigoPostal: p.codigoPostal || "",
                nombreEmpresa: p.nombreEmpresa || "",
                cif: p.cif || "",
              });
            })
            .catch(() => {});
        }
      })
      .catch(() => setErrorCarga("No se pudieron cargar tus datos. Recarga la página."))
      .finally(() => setCargandoDatos(false));
  }, []);

  // ── Validaciones inline ───────────────────────────────────────────────
  const erroresForm = {
    telefono: tocados.telefono && !telefonoValido(form.telefono) ? "Teléfono no válido" : "",
  };

  const formularioPersonalValido = telefonoValido(form.telefono);

  // ── Validación contraseña ─────────────────────────────────────────────
  const reglasPw = validarPassword(pw.nueva);
  const pwValida = reglasPw.longitud && reglasPw.numero && reglasPw.mayuscula;
  const pwCoincide = pw.confirmar.length > 0 && pw.nueva === pw.confirmar;
  const pwNoCoincide = pw.confirmar.length > 0 && pw.nueva !== pw.confirmar;

  // ── Handlers comunes ──────────────────────────────────────────────────
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleBlur(e) {
    setTocados(prev => ({ ...prev, [e.target.name]: true }));
  }

  function handleFotoChange(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setArchivoFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  }

  // ── Guardar datos personales ──────────────────────────────────────────
  async function handleGuardarPersonal(e) {
    e.preventDefault();
    if (!formularioPersonalValido) return;
    setErrorPersonal("");
    setExitoPersonal(false);
    setGuardandoPersonal(true);

    try {
      if (archivoFoto) {
        const res = await subirFotoPerfil(archivoFoto);
        setFotoUrlActual(res.fotoUrl);
        setArchivoFoto(null);
      }

      // Solo enviar campos con valor para evitar errores de validación
      const payload = {};
      if (form.nombre)    payload.nombre    = form.nombre;
      if (form.apellidos) payload.apellidos = form.apellidos;
      if (form.telefono)  payload.telefono  = form.telefono;
      if (form.ciudad)    payload.ciudad    = form.ciudad;
      if (form.direccion) payload.direccion = form.direccion;

      await actualizarMiUsuario(payload);
      await cargarUsuarioActual();

      setExitoPersonal(true);
      setTimeout(() => setExitoPersonal(false), 4000);
    } catch (err) {
      setErrorPersonal(err.message || "Error al guardar los datos");
    } finally {
      setGuardandoPersonal(false);
    }
  }

  // ── Guardar contraseña ────────────────────────────────────────────────
  async function handleGuardarPassword(e) {
    e.preventDefault();
    if (!pwValida || !pwCoincide) return;
    setErrorPw("");
    setExitoPw(false);
    setGuardandoPw(true);

    try {
      await actualizarMiUsuario({ password: pw.nueva });
      setPw({ nueva: "", confirmar: "" });
      setExitoPw(true);
      setTimeout(() => setExitoPw(false), 4000);
    } catch (err) {
      setErrorPw(err.message || "Error al cambiar la contraseña");
    } finally {
      setGuardandoPw(false);
    }
  }

  // ── Guardar perfil profesional ────────────────────────────────────────
  async function handleGuardarProfesional(e) {
    e.preventDefault();
    if (!perfilPro) return;
    setErrorPro("");
    setExitoPro(false);
    setGuardandoPro(true);

    try {
      await actualizarMiPerfil(perfilPro.id, {
        descripcion: formPro.descripcion,
        experiencia: Number(formPro.experiencia),
        codigoPostal: formPro.codigoPostal,
        nombreEmpresa: formPro.nombreEmpresa,
        cif: formPro.cif || null,
        plan: perfilPro.plan,
      });
      setExitoPro(true);
      setTimeout(() => setExitoPro(false), 4000);
    } catch (err) {
      setErrorPro(err.message || "Error al guardar el perfil");
    } finally {
      setGuardandoPro(false);
    }
  }

  const fotoActual = preview || (fotoUrlActual ? API_URL + fotoUrlActual : null);

  if (cargandoDatos) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400 text-sm">
        Cargando tu configuración...
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="max-w-2xl">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-4 text-sm">
          {errorCarga}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona tu información de cuenta.</p>
      </div>

      {/* ── SECCIÓN 1: FOTO + DATOS PERSONALES ────────────────────────── */}
      <form onSubmit={handleGuardarPersonal} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

        <h2 className="text-sm font-semibold text-gray-800">Datos personales</h2>

        {/* Foto */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {fotoActual ? (
              <img
                src={fotoActual}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-emerald-200 ring-offset-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-emerald-200 ring-offset-2">
                <UserCircleIcon className="w-10 h-10 text-white/80" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow transition">
              <CameraIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {archivoFoto ? archivoFoto.name : "Foto de perfil"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 mb-2">JPG, PNG o WebP · máx. 5 MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg transition">
              Cambiar foto
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Nombre" name="nombre" value={form.nombre}
            onChange={handleChange} onBlur={handleBlur} placeholder="Tu nombre" />
          <Campo label="Apellidos" name="apellidos" value={form.apellidos}
            onChange={handleChange} onBlur={handleBlur} placeholder="Tus apellidos" />

          {/* Email: solo lectura, no se puede modificar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <EnvelopeIcon className="w-4 h-4" />
              </span>
              <div className="w-full border border-gray-100 bg-gray-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-500 select-all">
                {emailActual}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde aquí.</p>
          </div>

          <Campo label="Teléfono" name="telefono" value={form.telefono}
            onChange={handleChange} onBlur={handleBlur}
            placeholder="+34 612 345 678"
            icono={<PhoneIcon className="w-4 h-4" />}
            error={erroresForm.telefono} />
          <Campo label="Ciudad" name="ciudad" value={form.ciudad}
            onChange={handleChange} onBlur={handleBlur}
            placeholder="Madrid"
            icono={<MapPinIcon className="w-4 h-4" />} />
          <Campo label="Dirección" name="direccion" value={form.direccion}
            onChange={handleChange} onBlur={handleBlur}
            placeholder="Calle, número..."
            icono={<HomeIcon className="w-4 h-4" />} />
        </div>

        <Banner tipo="error"   texto={errorPersonal} />
        <Banner tipo="exito"   texto={exitoPersonal ? "✓ Datos personales guardados." : ""} />

        <button
          type="submit"
          disabled={guardandoPersonal || !formularioPersonalValido}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm">
          {guardandoPersonal ? "Guardando..." : "Guardar datos personales"}
        </button>
      </form>

      {/* ── SECCIÓN 2: CONTRASEÑA ─────────────────────────────────────── */}
      <form onSubmit={handleGuardarPassword} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

        <div>
          <h2 className="text-sm font-semibold text-gray-800">Cambiar contraseña</h2>
          <p className="text-xs text-gray-400 mt-0.5">Deja los campos vacíos si no quieres cambiarla.</p>
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type={mostrarNueva ? "text" : "password"}
              value={pw.nueva}
              onChange={e => setPw(prev => ({ ...prev, nueva: e.target.value }))}
              placeholder="Mín. 8 caracteres"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <button type="button" onClick={() => setMostrarNueva(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {mostrarNueva ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* Indicadores de reglas */}
          {pw.nueva.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {[
                { ok: reglasPw.longitud,  texto: "8 caracteres" },
                { ok: reglasPw.numero,    texto: "1 número" },
                { ok: reglasPw.mayuscula, texto: "1 mayúscula" },
              ].map(r => (
                <li key={r.texto} className={`flex items-center gap-1 text-xs ${r.ok ? "text-emerald-600" : "text-gray-400"}`}>
                  {r.ok
                    ? <CheckCircleIcon className="w-3.5 h-3.5" />
                    : <XCircleIcon className="w-3.5 h-3.5" />}
                  {r.texto}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type={mostrarConfirmar ? "text" : "password"}
              value={pw.confirmar}
              onChange={e => setPw(prev => ({ ...prev, confirmar: e.target.value }))}
              placeholder="Repite la contraseña"
              className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                pwCoincide   ? "border-emerald-300 focus:ring-emerald-400"
                : pwNoCoincide ? "border-red-300 focus:ring-red-400"
                : "border-gray-200 focus:ring-emerald-500"
              }`}
            />
            <button type="button" onClick={() => setMostrarConfirmar(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {mostrarConfirmar ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          {pwCoincide    && <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1"><CheckCircleIcon className="w-3.5 h-3.5" />Las contraseñas coinciden</p>}
          {pwNoCoincide  && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><XCircleIcon className="w-3.5 h-3.5" />Las contraseñas no coinciden</p>}
        </div>

        <Banner tipo="error" texto={errorPw} />
        <Banner tipo="exito" texto={exitoPw ? "✓ Contraseña actualizada correctamente." : ""} />

        <button
          type="submit"
          disabled={guardandoPw || !pw.nueva || !pwValida || !pwCoincide}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm">
          {guardandoPw ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>

      {/* ── SECCIÓN 3: PERFIL PROFESIONAL ────────────────────────────── */}
      {esProfesional && (
        <form onSubmit={handleGuardarProfesional} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

          <div>
            <h2 className="text-sm font-semibold text-gray-800">Perfil profesional</h2>
            <p className="text-xs text-gray-400 mt-0.5">Información visible en tus anuncios de servicio.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción profesional</label>
            <textarea
              name="descripcion"
              value={formPro.descripcion}
              onChange={e => setFormPro(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              placeholder="Describe tu experiencia y especialidades..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de experiencia
                <span className="ml-2 font-bold text-emerald-600">{formPro.experiencia}</span>
              </label>
              <input type="range" name="experiencia" value={formPro.experiencia}
                onChange={e => setFormPro(prev => ({ ...prev, experiencia: e.target.value }))}
                min="0" max="40" step="1" className="w-full accent-emerald-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span>
              </div>
            </div>

            <Campo label="Código postal" name="codigoPostal" value={formPro.codigoPostal}
              onChange={e => setFormPro(prev => ({ ...prev, codigoPostal: e.target.value }))}
              placeholder="28001"
              icono={<MapPinIcon className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Nombre de empresa (opcional)" name="nombreEmpresa" value={formPro.nombreEmpresa}
              onChange={e => setFormPro(prev => ({ ...prev, nombreEmpresa: e.target.value }))}
              placeholder="Tu empresa S.L."
              icono={<BuildingOfficeIcon className="w-4 h-4" />} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CIF (opcional)</label>
              <input
                type="text"
                value={formPro.cif}
                onChange={e => setFormPro(prev => ({ ...prev, cif: e.target.value.toUpperCase() }))}
                placeholder="B12345678"
                maxLength={12}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition uppercase"
              />
              <p className="text-xs text-gray-400 mt-1">Identificador fiscal de tu empresa.</p>
            </div>
          </div>

          <Banner tipo="error" texto={errorPro} />
          <Banner tipo="exito" texto={exitoPro ? "✓ Perfil profesional guardado." : ""} />

          <button
            type="submit"
            disabled={guardandoPro}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm">
            {guardandoPro ? "Guardando..." : "Guardar perfil profesional"}
          </button>
        </form>
      )}

    </div>
  );
}

export default Configuracion;
