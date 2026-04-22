package com.jobfree.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Representa una subcategoría de servicios dentro de una categoría principal.
 * 
 * Ejemplo: Categoría: "Clases" Subcategorías: "Bachillerato"
 */
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "subcategoria_servicio")
public class SubcategoriaServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(length = 300)
	private String descripcion;

	@Column(length = 200)
	private String imagen;

	// Muchas subcategorías pertenecen a una misma categoría
	@NotNull(message = "La categoría es obligatoria")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "categoria_id", nullable = false)
	private CategoriaServicio categoria;

	// Constructor vacío obligatorio
	public SubcategoriaServicio() {
	}

	public SubcategoriaServicio(String nombre, String descripcion, String imagen, CategoriaServicio categoria) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.imagen = imagen;
		this.categoria = categoria;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

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

	public CategoriaServicio getCategoria() {
		return categoria;
	}

	public void setCategoria(CategoriaServicio categoria) {
		this.categoria = categoria;
	}

}
