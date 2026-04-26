import { apiFetch } from "./config";

export async function crearValoracion(datos) {
  const res = await apiFetch("/valoraciones", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "No se pudo enviar la valoración");
  }
  return res.json();
}

export async function obtenerMisValoraciones() {
  const res = await apiFetch("/valoraciones/mias");
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "No se pudieron cargar tus valoraciones");
  }
  return res.json();
}

export async function obtenerValoracionesPorProfesional(profesionalId) {
  const res = await apiFetch(`/valoraciones/profesionales/${profesionalId}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "No se pudieron cargar las valoraciones");
  }
  return res.json();
}
