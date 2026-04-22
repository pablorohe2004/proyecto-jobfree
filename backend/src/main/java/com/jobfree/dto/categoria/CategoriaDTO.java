package com.jobfree.dto.categoria;

/**
 * DTO para mostrar una categoría.
 */
public class CategoriaDTO {

	private Long id;
	private String nombre;

	public CategoriaDTO() {
		super();
	}

	public CategoriaDTO(Long id, String nombre) {
		this.id = id;
		this.nombre = nombre;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}
}
