import { apiFetch } from "./config";

export async function obtenerMisFavoritos() {
  const res = await apiFetch("/favoritos");
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener tus favoritos");
  }
  return res.json();
}

export async function anadirFavorito(servicioId) {
  const res = await apiFetch("/favoritos", {
    method: "POST",
    body: JSON.stringify({ servicioId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "No se pudo guardar el favorito");
  }
  return res.json();
}

export async function eliminarFavorito(servicioId) {
  const res = await apiFetch(`/favoritos/servicio/${servicioId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "No se pudo eliminar el favorito");
  }
}
