import { apiFetch } from "./config";

export async function obtenerProfesionales(pagina = 0, size = 20) {
  const res = await apiFetch(`/profesionales?page=${pagina}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener profesionales");
  return res.json();
}

export async function obtenerMiPerfil() {
  const res = await apiFetch("/profesionales/mio");
  if (!res.ok) throw new Error("Perfil no encontrado");
  return res.json();
}

export async function crearMiPerfil(datos) {
  const res = await apiFetch("/profesionales", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear el perfil profesional");
  }
  return res.json();
}

export async function actualizarMiPerfil(id, datos) {
  const res = await apiFetch("/profesionales/" + id, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar el perfil profesional");
  }
  return res.json();
}

/**
 * Guarda las coordenadas GPS del profesional autenticado.
 * @param {number} latitud
 * @param {number} longitud
 */
export async function actualizarUbicacion(latitud, longitud) {
  const res = await apiFetch("/profesionales/mio/ubicacion", {
    method: "PATCH",
    body: JSON.stringify({ latitud, longitud }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al guardar la ubicación");
  }
  return res.json();
}

/**
 * Elimina las coordenadas GPS del profesional autenticado.
 */
export async function limpiarUbicacion() {
  const res = await apiFetch("/profesionales/mio/ubicacion/limpiar", {
    method: "PATCH",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al limpiar la ubicación");
  }
  return res.json();
}

/**
 * Busca profesionales cercanos a unas coordenadas.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radio - radio en km (por defecto 20)
 * @returns {Promise<Array>} lista de ProfesionalDTO con campo distanciaKm
 */
export async function obtenerProfesionalesCercanos(lat, lng, radio = 20) {
  const res = await apiFetch(`/profesionales/cercanos?lat=${lat}&lng=${lng}&radio=${radio}`);
  if (!res.ok) throw new Error("Error al buscar profesionales cercanos");
  return res.json();
}

export async function obtenerProfesionalPorId(id) {
  const res = await apiFetch(`/profesionales/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el perfil del profesional");
  return res.json();
}
