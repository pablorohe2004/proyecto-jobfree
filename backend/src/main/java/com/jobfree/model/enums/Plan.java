package com.jobfree.model.enums;

/**
 * Planes que puede contratar un profesional en la plataforma.
 */
public enum Plan {

	// Plan básico con funcionalidades limitadas
	BASICO("Básico"),

	// Plan intermedio con más visibilidad
	PRO("Pro"),

	// Plan avanzado con todas las ventajas
	PREMIUM("Premium");

	private final String label;

	Plan(String label) {
		this.label = label;
	}

	public String getLabel() {
		return label;
	}
}
