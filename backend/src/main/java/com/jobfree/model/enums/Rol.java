package com.jobfree.model.enums;

/**
 * Tipos de usuario que existen en la plataforma.
 */
public enum Rol {

	// Usuario que contrata servicios
	CLIENTE("Cliente"),

	// Usuario que ofrece servicios
	PROFESIONAL("Profesional"),

	// Administrador de la plataforma
	ADMIN("Administrador");

	private final String label;

	Rol(String label) {
		this.label = label;
	}

	public String getLabel() {
		return label;
	}

}
