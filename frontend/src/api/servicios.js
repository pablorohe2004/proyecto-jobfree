// importamos la URL del backend
import API_URL from "api/config";

// todos los servicios
export async function obtenerServicios() {
  const res = await fetch(API_URL + "/servicios");

  if (!res.ok) {
    throw new Error("Error al obtener servicios");
  }

  return res.json();
}

// servicios por categoría
export async function obtenerServiciosPorCategoria(id) {
  const res = await fetch(API_URL + "/servicios/categoria/" + id);

  if (!res.ok) {
    throw new Error("Error al obtener servicios por categoría");
  }

  return res.json();
}

// servicios por subcategoría CON PAGINACIÓN
export async function obtenerServiciosPorSubcategoria(id, pagina = 0) {

  const res = await fetch(
    API_URL + "/servicios/subcategoria/" + id + "?page=" + pagina + "&size=8"
  );

  if (!res.ok) {
    throw new Error("Error al obtener servicios por subcategoría");
  }

  return res.json();
}
