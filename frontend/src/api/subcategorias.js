import API_URL from "./config";

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
