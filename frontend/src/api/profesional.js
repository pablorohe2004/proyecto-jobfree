import API_URL from "./config";

/**
 * Obtiene el perfil profesional del usuario autenticado.
 * Devuelve 404 si todavía no ha creado su perfil.
 *
 * @param {string} token JWT del usuario logueado
 * @returns {Promise<Object>} perfil profesional
 */
export async function obtenerMiPerfil(token) {
  const res = await fetch(API_URL + "/profesionales/mio", {
    headers: {
      "Accept": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    throw new Error("Perfil no encontrado");
  }

  return res.json();
}

/**
 * Crea el perfil profesional del usuario autenticado.
 * Solo se llama la primera vez que publica un servicio.
 *
 * @param {string} token JWT del usuario logueado
 * @param {Object} datos { descripcion, experiencia, codigoPostal, plan }
 * @returns {Promise<Object>} perfil creado
 */
export async function crearMiPerfil(token, datos) {
  const res = await fetch(API_URL + "/profesionales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear el perfil profesional");
  }

  return res.json();
}

/**
 * Actualiza el perfil profesional del usuario autenticado.
 *
 * @param {string} token JWT del usuario logueado
 * @param {number} id ID del perfil profesional
 * @param {Object} datos campos a actualizar
 * @returns {Promise<Object>} perfil actualizado
 */
export async function actualizarMiPerfil(token, id, datos) {
  const res = await fetch(API_URL + "/profesionales/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar el perfil profesional");
  }

  return res.json();
}
