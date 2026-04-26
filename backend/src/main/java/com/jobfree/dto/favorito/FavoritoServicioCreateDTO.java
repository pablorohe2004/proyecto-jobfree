package com.jobfree.dto.favorito;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear un nuevo favorito de servicio.
 */
public class FavoritoServicioCreateDTO {

	@NotNull(message = "El ID del servicio es obligatorio")
	private Long servicioId;

	// Constructor vacío
	public FavoritoServicioCreateDTO() {
	}

	public FavoritoServicioCreateDTO(Long servicioId) {
		this.servicioId = servicioId;
	}

	// Getters y Setters

	public Long getServicioId() {
		return servicioId;
	}

	public void setServicioId(Long servicioId) {
		this.servicioId = servicioId;
	}
}
