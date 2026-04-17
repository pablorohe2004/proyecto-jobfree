// Importamos los textos
import { textos } from "./textos";

// Exportamos textos para poder usarlos en otros archivos
export { textos };

// Función para traducir según idioma y clave
export function t(idioma, clave, variables = {}) {

  const partes = clave.split(".");
  let resultado = textos[idioma];

  // Recorremos la clave (ej: servicios.titulo)
  for (let parte of partes) {
    if (resultado && resultado[parte] !== undefined) {
      resultado = resultado[parte];
    } else {
      return clave;
    }
  }

  // Si es array, lo devolvemos directamente
  if (typeof resultado !== "string") return resultado;

  // Reemplazo de variables
  for (let key in variables) {
    resultado = resultado.replace(`{${key}}`, variables[key]);
  }

  return resultado;
}
