package com.jobfree.dto.servicio;

import java.math.BigDecimal;

/**
 * DTO para mostrar un servicio.
 */
public class ServicioDTO {

	private Long id;
	private String titulo;
	private String descripcion;
	private Integer duracionMin;
	private BigDecimal precioHora;
	private boolean activa;
	private Long subcategoriaId;

	public ServicioDTO() {
	}

	public ServicioDTO(Long id, String titulo, String descripcion, Integer duracionMin, BigDecimal precioHora,
			boolean activa, Long subcategoriaId) {
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.duracionMin = duracionMin;
		this.precioHora = precioHora;
		this.activa = activa;
		this.subcategoriaId = subcategoriaId;
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

}
