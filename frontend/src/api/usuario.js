import { apiFetch } from "./config";
import API_URL from "./config";

/**
 * Actualiza los datos del usuario autenticado.
 * Llama a PATCH /usuarios/me
 */
export async function actualizarMiUsuario(datos) {
  const res = await apiFetch("/usuarios/me", {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al guardar los cambios");
  }
  return res.json();
}

/**
 * Sube una foto de perfil.
 * Llama a POST /usuarios/me/foto con multipart/form-data.
 * Devuelve { fotoUrl: "/uploads/fotos/xxx.jpg" }
 */
export async function subirFotoPerfil(archivo) {
  const formData = new FormData();
  formData.append("foto", archivo);

  const res = await fetch(API_URL + "/usuarios/me/foto", {
    method: "POST",
    credentials: "include",
    body: formData,
    // No ponemos Content-Type manualmente — el navegador lo añade con el boundary
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Error al subir la imagen");
  }

  return res.json();
}
