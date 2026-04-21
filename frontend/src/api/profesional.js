import { apiFetch } from "./config";

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
