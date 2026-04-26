import { apiFetch } from "./config";

export async function obtenerMisNotificaciones() {
  const res = await apiFetch("/notificaciones/mias");
  if (!res.ok) throw new Error("Error al obtener las notificaciones");
  return res.json();
}

export async function marcarNotificacionComoLeida(id) {
  const res = await apiFetch(`/notificaciones/${id}/leida`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al marcar la notificación como leída");
  return res.json();
}
