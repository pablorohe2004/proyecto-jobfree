package com.jobfree.dto.servicio;

import java.math.BigDecimal;

/**
 * DTO para mostrar un servicio junto con los datos básicos del profesional que lo ofrece.
 * Incluimos los datos del profesional aquí para que el frontend no necesite
 * hacer una segunda petición para mostrar quién ofrece cada servicio.
 */
public class ServicioDTO {

	private Long id;
	private String titulo;
	private String descripcion;
	private Integer duracionMin;
	private BigDecimal precioHora;
	private boolean activa;
	private Long subcategoriaId;
	private String subcategoriaNombre;

	// Datos del profesional que ofrece este servicio
	private Long profesionalId;
	private String nombreProfesional;
	private String ciudadProfesional;
	private Double valoracionMedia;
	private Integer numeroValoraciones;

	public ServicioDTO() {
	}

	public ServicioDTO(Long id, String titulo, String descripcion, Integer duracionMin, BigDecimal precioHora,
			boolean activa, Long subcategoriaId, String subcategoriaNombre,
			Long profesionalId, String nombreProfesional, String ciudadProfesional,
			Double valoracionMedia, Integer numeroValoraciones) {
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.duracionMin = duracionMin;
		this.precioHora = precioHora;
		this.activa = activa;
		this.subcategoriaId = subcategoriaId;
		this.subcategoriaNombre = subcategoriaNombre;
		this.profesionalId = profesionalId;
		this.nombreProfesional = nombreProfesional;
		this.ciudadProfesional = ciudadProfesional;
		this.valoracionMedia = valoracionMedia;
		this.numeroValoraciones = numeroValoraciones;
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public Integer getDuracionMin() {
		return duracionMin;
	}

	public BigDecimal getPrecioHora() {
		return precioHora;
	}

	public boolean isActiva() {
		return activa;
	}

	public Long getSubcategoriaId() {
		return subcategoriaId;
	}

	public String getSubcategoriaNombre() {
		return subcategoriaNombre;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public String getNombreProfesional() {
		return nombreProfesional;
	}

	public String getCiudadProfesional() {
		return ciudadProfesional;
	}

	public Double getValoracionMedia() {
		return valoracionMedia;
	}

	public Integer getNumeroValoraciones() {
		return numeroValoraciones;
	}

}
