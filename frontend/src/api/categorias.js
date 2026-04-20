import API_URL from "api/config";

async function apiFetch(endpoint) {
  const res = await fetch(API_URL + endpoint);

  if (!res.ok) {
    throw new Error("Error en la API");
  }

  return res.json();
}

export function obtenerCategorias() {
  return apiFetch("/categorias");
}
