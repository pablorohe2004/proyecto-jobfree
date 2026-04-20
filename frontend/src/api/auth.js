import API_URL from "./config";

// Cabeceras comunes para todas las peticiones JSON al backend.
// Incluimos Accept: application/json para que Spring Boot devuelva siempre
// errores en JSON y no en HTML (su página de error Whitelabel por defecto).
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

/**
 * Hace login en el backend y devuelve el token JWT.
 * El backend responde con el token directamente como texto plano.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} token JWT
 */
export async function login(email, password) {
  const res = await fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  // El backend devuelve el token como string puro (no JSON)
  return res.text();
}

/**
 * Obtiene los datos del usuario autenticado enviando el token JWT.
 *
 * @param {string} token token JWT guardado tras el login
 * @returns {Promise<Object>} datos del usuario { id, nombreCompleto, email, ciudad, rol }
 */
export async function getMe(token) {
  const res = await fetch(API_URL + "/auth/me", {
    headers: {
      "Accept": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener el perfil del usuario");
  }

  return res.json();
}

/**
 * Registra un nuevo usuario con rol CLIENTE.
 *
 * @param {Object} datos { nombre, apellidos, email, telefono, password }
 * @returns {Promise<Object>} usuario creado
 */
export async function registrarCliente(datos) {
  const res = await fetch(API_URL + "/usuarios/cliente", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el usuario"));
  }

  return res.json();
}

/**
 * Registra un nuevo usuario con rol PROFESIONAL.
 *
 * @param {Object} datos { nombre, apellidos, email, telefono, password }
 * @returns {Promise<Object>} usuario creado
 */
export async function registrarProfesional(datos) {
  const res = await fetch(API_URL + "/usuarios/profesional", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el profesional"));
  }

  return res.json();
}

/**
 * Extrae el mensaje legible de una respuesta de error del backend.
 * Spring Boot devuelve errores como JSON: { status, error, message, path }.
 * Con server.error.include-message=always el campo message tiene el texto real.
 *
 * @param {Response} res respuesta fetch con res.ok === false
 * @param {string} fallback mensaje si el cuerpo no tiene información útil
 * @returns {Promise<string>} mensaje de error legible
 */
async function extraerMensajeError(res, fallback) {
  try {
    const json = await res.json();
    return json.message || json.error || fallback;
  } catch {
    return fallback;
  }
}
