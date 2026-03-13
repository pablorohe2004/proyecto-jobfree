package com.jobfree.model.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Representa una categoría de servicios (Electricidad, Limpieza,
 * Jardinería...).
 */
@Entity
@Table(name = "categoria_servicio")
public class CategoriaServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 100)
	private String nombre;

	@Column(length = 300)
	private String descripcion;

	@Column(length = 200)
	private String imagen;

	// Una categoría puede tener muchos servicios asociados
	@OneToMany(mappedBy = "categoria")
	@JsonIgnore
	private List<ServicioOfrecido> servicios;

	// Constructor vacío obligatorio
	public CategoriaServicio() {
	}

	public CategoriaServicio(String nombre, String descripcion, String imagen) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.imagen = imagen;
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

	public List<ServicioOfrecido> getServicios() {
		return servicios;
	}

	public void setServicios(List<ServicioOfrecido> servicios) {
		this.servicios = servicios;
	}

}
