import { apiFetch } from "./config";

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

  // apiFetch no añade Content-Type cuando el body no es string,
  // dejando que el navegador lo establezca con el boundary correcto.
  const res = await apiFetch("/usuarios/me/foto", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Error al subir la imagen");
  }

  return res.json();
}
