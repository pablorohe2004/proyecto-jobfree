package com.jobfree.model.enums;

/**
 * Estados posibles de un pago.
 */
public enum EstadoPago {

	// No pagado aún
	PENDIENTE("Pendiente"),

	// Pagado correctamente
	PAGADO("Pagado"),

	// Devuelto al cliente
	REEMBOLSADO("Reembolsado");

	// Texto para mostrar
	private final String label;

	// Asigna el texto
	EstadoPago(String label) {
		this.label = label;
	}

	// Obtiene el texto
	public String getLabel() {
		return label;
	}
}
