// importamos la URL del backend
import API_URL from "./config";

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

// solo los servicios activos (para el buscador del dashboard)
export async function obtenerServiciosActivos() {
  const res = await fetch(API_URL + "/servicios/activos");

  if (!res.ok) {
    throw new Error("Error al obtener servicios activos");
  }

  return res.json();
}

// publica un nuevo servicio (solo profesionales autenticados)
export async function crearServicio(token, datos) {
  const res = await fetch(API_URL + "/servicios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    // Intentamos leer el cuerpo de la respuesta (puede ser JSON o texto)
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