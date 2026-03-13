// importamos la URL del backend
import API_URL from "./api";

// función para obtener las categorías desde el backend
export function obtenerCategorias() {
  return fetch(API_URL + "/categorias") // llama a la API
    .then(response => response.json()); // convierte la respuesta a JSON
}
