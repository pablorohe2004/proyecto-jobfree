package com.jobfree.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

/**
 * Representa una categoría principal del menú (Mantenimiento, Reparaciones,
 * Mascotas, Clases...).
 */
@Entity
@Table(name = "categoria_servicio")
public class CategoriaServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false, unique = true, length = 100)
	private String nombre;

	// Una categoría puede tener muchas subcategorías asociadas
	@OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<SubcategoriaServicio> subcategorias = new ArrayList<>();

	// Constructor vacío obligatorio
	public CategoriaServicio() {
	}

	public CategoriaServicio(String nombre) {
		this.nombre = nombre;
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

	public List<SubcategoriaServicio> getSubcategorias() {
		return subcategorias;
	}

	public void setSubcategorias(List<SubcategoriaServicio> subcategorias) {
		this.subcategorias = subcategorias;
	}

}
