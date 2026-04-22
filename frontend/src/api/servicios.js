import { apiFetch } from "./config";

export async function obtenerServicios(pagina = 0, size = 20) {
  const res = await apiFetch(`/servicios?page=${pagina}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
}

export async function obtenerServiciosActivos(pagina = 0, size = 20) {
  const res = await apiFetch(`/servicios/activos?page=${pagina}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener servicios activos");
  return res.json();
}

export async function obtenerServiciosPorSubcategoria(id, pagina = 0, size = 8) {
  const res = await apiFetch(
    "/servicios/subcategoria/" + id + "?page=" + pagina + "&size=" + size
  );
  if (!res.ok) throw new Error("Error al obtener servicios por subcategoría");
  return res.json();
}

export async function obtenerMisServicios() {
  const res = await apiFetch("/servicios/mios");
  if (!res.ok) throw new Error("Error al obtener tus servicios");
  return res.json();
}

export async function crearServicio(datos) {
  const res = await apiFetch("/servicios", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const texto = await res.text().catch(() => "");
    let mensaje = `Error al publicar el servicio (HTTP ${res.status})`;
    try {
      const json = JSON.parse(texto);
      if (json.message) mensaje = json.message;
      else if (json.error) mensaje = json.error;
    } catch { /* no era JSON */ }
    throw new Error(mensaje);
  }
  return res.json();
}

export async function actualizarServicio(id, datos) {
  const res = await apiFetch("/servicios/" + id, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar el servicio");
  }
  return res.json();
}

export async function eliminarServicio(id) {
  const res = await apiFetch("/servicios/" + id, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el servicio");
}

export async function activarServicio(id) {
  const res = await apiFetch("/servicios/" + id + "/activar", { method: "PATCH" });
  if (!res.ok) throw new Error("Error al activar el servicio");
  return res.json();
}

export async function desactivarServicio(id) {
  const res = await apiFetch("/servicios/" + id + "/desactivar", { method: "PATCH" });
  if (!res.ok) throw new Error("Error al desactivar el servicio");
  return res.json();
}
