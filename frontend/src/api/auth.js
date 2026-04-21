import { apiFetch } from "./config";

const ERROR_RED = "No se pudo conectar con el servidor. Comprueba que el backend está en marcha.";

export async function login(email, password) {
  let res;
  try {
    res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json(); // { usuario }
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // ignorar errores de red en el logout
  }
}

export async function getMe() {
  let res;
  try {
    res = await apiFetch("/auth/me");
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) throw new Error("No autenticado");
  return res.json();
}

export async function registrarCliente(datos) {
  let res;
  try {
    res = await apiFetch("/usuarios/cliente", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el usuario"));
  }
  return res.json();
}

export async function registrarProfesional(datos) {
  let res;
  try {
    res = await apiFetch("/usuarios/profesional", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el profesional"));
  }
  return res.json();
}

/**
 * Guarda el rol deseado en la sesión del backend antes de iniciar OAuth2.
 * Debe llamarse justo antes de redirigir a /oauth2/authorization/{proveedor}.
 */
export async function iniciarOAuth(rol) {
  try {
    await apiFetch("/auth/iniciar-oauth", {
      method: "POST",
      body: JSON.stringify({ rol }),
    });
  } catch {
    // Si falla, el backend usará CLIENTE por defecto
  }
}

async function extraerMensajeError(res, fallback) {
  try {
    const json = await res.json();
    return json.message || json.error || fallback;
  } catch {
    return fallback;
  }
}
