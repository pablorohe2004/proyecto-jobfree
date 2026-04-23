package com.jobfree.dto.reserva;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear una reserva.
 */
public class ReservaCreateDTO {

	@NotNull
	private Long servicioId;

	private LocalDateTime fechaInicio;

	private String descripcion;

	public Long getServicioId() {
		return servicioId;
	}

	public void setServicioId(Long servicioId) {
		this.servicioId = servicioId;
	}

	public LocalDateTime getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDateTime fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
