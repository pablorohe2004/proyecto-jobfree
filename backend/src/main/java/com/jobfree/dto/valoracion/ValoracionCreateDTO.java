package com.jobfree.dto.valoracion;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear una valoración con estrellas, comentario y referencias.
 */
public class ValoracionCreateDTO {

	@NotNull
	@Min(1)
	@Max(5)
	private Integer estrellas;

	@Size(max = 1000)
	private String comentario;

	@NotNull
	private Long reservaId;

	@NotNull
	private Long profesionalId;

	// Getters y Setters

	public Integer getEstrellas() {
		return estrellas;
	}

	public void setEstrellas(Integer estrellas) {
		this.estrellas = estrellas;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public void setProfesionalId(Long profesionalId) {
		this.profesionalId = profesionalId;
	}
}
