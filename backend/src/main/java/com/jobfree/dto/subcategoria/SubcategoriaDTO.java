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
	private String categoriaNombre;

	public SubcategoriaDTO() {
	}

	public SubcategoriaDTO(Long id, String nombre, String descripcion, String imagen, Long categoriaId, String categoriaNombre) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.imagen = imagen;
		this.categoriaId = categoriaId;
		this.categoriaNombre = categoriaNombre;
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

	public String getCategoriaNombre() {
		return categoriaNombre;
	}
}
