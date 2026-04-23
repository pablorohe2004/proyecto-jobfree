import { apiFetch } from "./config";

export async function obtenerMensajesDeConversacion(conversacionId) {
  const res = await apiFetch(`/mensajes/conversaciones/${conversacionId}`);
  if (!res.ok) throw new Error("Error al obtener los mensajes");
  return res.json();
}

export async function enviarMensaje(datos) {
  const res = await apiFetch("/mensajes", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al enviar el mensaje");
  }
  return res.json();
}

export async function marcarMensajeLeido(id) {
  const res = await apiFetch(`/mensajes/${id}/leido`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al marcar el mensaje como leído");
  return res.json();
}

export async function marcarMensajeRecibido(id) {
  const res = await apiFetch(`/mensajes/${id}/recibido`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al marcar el mensaje como recibido");
  return res.json();
}

export async function marcarMensajesRecibidos(ids) {
  const mensajeIds = [...new Set((ids || []).map(Number).filter(Boolean))];
  if (mensajeIds.length === 0) return [];

  const res = await apiFetch("/mensajes/recibido/lote", {
    method: "PATCH",
    body: JSON.stringify({ mensajeIds }),
  });
  if (!res.ok) throw new Error("Error al marcar los mensajes como recibidos");
  return res.json();
}

export async function marcarMensajesLeidos(ids) {
  const mensajeIds = [...new Set((ids || []).map(Number).filter(Boolean))];
  if (mensajeIds.length === 0) return [];

  const res = await apiFetch("/mensajes/leido/lote", {
    method: "PATCH",
    body: JSON.stringify({ mensajeIds }),
  });
  if (!res.ok) throw new Error("Error al marcar los mensajes como leídos");
  return res.json();
}
