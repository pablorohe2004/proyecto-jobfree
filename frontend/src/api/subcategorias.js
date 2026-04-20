import API_URL from "./config";

// todas las subcategorías (para el selector del formulario de servicios)
export async function obtenerTodasSubcategorias() {
  const res = await fetch(API_URL + "/subcategorias");

  if (!res.ok) {
    throw new Error("Error al obtener subcategorías");
  }

  return res.json();
}

// subcategorías por categoría con paginación
export async function obtenerSubcategoriasPorCategoria(id, pagina = 0) {

  const res = await fetch(
    API_URL + "/subcategorias/categoria/" + id + "?page=" + pagina + "&size=8"
  );

  if (!res.ok) {
    throw new Error("Error al obtener subcategorías");
  }

  return res.json();
}
