import { apiFetch } from "./config";

export async function crearReserva(servicioId, fechaInicio) {
  const res = await apiFetch("/reservas", {
    method: "POST",
    body: JSON.stringify({ servicioId, fechaInicio }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al enviar la solicitud");
  }
  return res.json();
}

export async function obtenerMisReservas() {
  const res = await apiFetch("/reservas/mias");
  if (!res.ok) throw new Error("Error al obtener las reservas");
  return res.json();
}

export async function obtenerReservasRecibidas() {
  const res = await apiFetch("/reservas/recibidas");
  if (!res.ok) throw new Error("Error al obtener las solicitudes");
  return res.json();
}

export async function confirmarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/confirmar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al aceptar la solicitud");
  }
  return res.json();
}

export async function denegarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/cancelar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al denegar la solicitud");
  }
  return res.json();
}
