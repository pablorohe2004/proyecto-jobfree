import { textos } from "./textos";

export function t(idioma, clave) {
  return textos[idioma][clave] || clave;
}