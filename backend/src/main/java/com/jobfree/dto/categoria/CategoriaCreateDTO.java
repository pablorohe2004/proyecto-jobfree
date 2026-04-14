package com.jobfree.dto.categoria;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para crear una categoría.
 */
public class CategoriaCreateDTO {
	
	@NotBlank
	private String nombre;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
}
