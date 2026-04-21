import { apiFetch } from "./config";

export async function obtenerServicios() {
  const res = await apiFetch("/servicios");
  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
}

export async function obtenerServiciosPorCategoria(id) {
  const res = await apiFetch("/servicios/categoria/" + id);
  if (!res.ok) throw new Error("Error al obtener servicios por categoría");
  return res.json();
}

export async function obtenerServiciosActivos() {
  const res = await apiFetch("/servicios/activos");
  if (!res.ok) throw new Error("Error al obtener servicios activos");
  return res.json();
}

export async function obtenerServiciosPorSubcategoria(id, pagina = 0) {
  const res = await apiFetch(
    "/servicios/subcategoria/" + id + "?page=" + pagina + "&size=8"
  );
  if (!res.ok) throw new Error("Error al obtener servicios por subcategoría");
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
    } catch { /* la respuesta no era JSON */ }
    throw new Error(mensaje);
  }

  return res.json();
}
