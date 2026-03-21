// importamos la URL del backend
import API_URL from "./config";

// función para obtener todos los servicios
export function obtenerServicios() {
  return fetch(API_URL + "/servicios") // llama al endpoint de servicios
    .then(response => response.json()); // convierte la respuesta a JSON
}

// función para obtener servicios de una categoría concreta
export function obtenerServiciosPorCategoria(id) {
  return fetch(API_URL + "/servicios/categoria/" + id) // llama al endpoint con el id de la categoría
    .then(response => response.json()); // convierte la respuesta a JSON
}
