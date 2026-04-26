package com.jobfree.dto.favorito;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.dto.servicio.ServicioDTO;

/**
 * DTO para representar un servicio marcado como favorito.
 */
public class FavoritoServicioDTO {

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private LocalDateTime fechaCreacion;

	private ServicioDTO servicio;

	// Constructor vacío
	public FavoritoServicioDTO() {
	}

	public FavoritoServicioDTO(Long id, LocalDateTime fechaCreacion, ServicioDTO servicio) {
		this.id = id;
		this.fechaCreacion = fechaCreacion;
		this.servicio = servicio;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public ServicioDTO getServicio() {
		return servicio;
	}

	public void setServicio(ServicioDTO servicio) {
		this.servicio = servicio;
	}
}
