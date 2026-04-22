package com.jobfree.dto.subcategoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear una subcategoría.
 */
public class SubcategoriaCreateDTO {

	@NotBlank
	private String nombre;

	private String descripcion;
	private String imagen;

	@NotNull
	private Long categoriaId;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public Long getCategoriaId() {
		return categoriaId;
	}

	public void setCategoriaId(Long categoriaId) {
		this.categoriaId = categoriaId;
	}

}
