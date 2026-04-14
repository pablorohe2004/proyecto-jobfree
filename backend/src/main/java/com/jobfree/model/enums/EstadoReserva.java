package com.jobfree.model.enums;

/**
 * Representa los posibles estados de una reserva.
 */
public enum EstadoReserva {

	// Pendiente de confirmar
	PENDIENTE("Pendiente"),

	// Aceptada por el profesional
	CONFIRMADA("Confirmada"),

	// Servicio ya realizado
	COMPLETADA("Completada"),

	// Cancelada por cliente o profesional
	CANCELADA("Cancelada");

	// Texto para mostrar
	private final String label;

	// Asigna el texto
	EstadoReserva(String label) {
		this.label = label;
	}

	// Obtiene el texto
	public String getLabel() {
		return label;
	}
}
