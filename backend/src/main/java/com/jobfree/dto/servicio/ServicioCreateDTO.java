package com.jobfree.dto.servicio;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear un servicio.
 */
public class ServicioCreateDTO {

	@NotBlank
	private String titulo;

	@NotBlank
	private String descripcion;

	@NotNull
	@Min(1)
	private Integer duracionMin;

	@NotNull
	@DecimalMin("0.01")
	private BigDecimal precioHora;

	@NotNull
	private Long subcategoriaId;

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getDuracionMin() {
		return duracionMin;
	}

	public void setDuracionMin(Integer duracionMin) {
		this.duracionMin = duracionMin;
	}

	public BigDecimal getPrecioHora() {
		return precioHora;
	}

	public void setPrecioHora(BigDecimal precioHora) {
		this.precioHora = precioHora;
	}

	public Long getSubcategoriaId() {
		return subcategoriaId;
	}

	public void setSubcategoriaId(Long subcategoriaId) {
		this.subcategoriaId = subcategoriaId;
	}

}
