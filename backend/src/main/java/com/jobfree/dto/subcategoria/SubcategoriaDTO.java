package com.jobfree.dto.subcategoria;

/**
 * DTO para mostrar una subcategoría.
 */
public class SubcategoriaDTO {

	private Long id;
	private String nombre;
	private String descripcion;
	private String imagen;
	private Long categoriaId;

	public SubcategoriaDTO() {
	}

	public SubcategoriaDTO(Long id, String nombre, String descripcion, String imagen, Long categoriaId) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.imagen = imagen;
		this.categoriaId = categoriaId;
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public String getImagen() {
		return imagen;
	}

	public Long getCategoriaId() {
		return categoriaId;
	}
}
