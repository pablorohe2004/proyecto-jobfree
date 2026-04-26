package com.jobfree.dto.resena;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear una nueva reseña de profesional.
 */
public class ResenaProfesionalCreateDTO {

	@NotNull(message = "La calificación es obligatoria")
	@Min(value = 1, message = "La calificación mínima es 1")
	@Max(value = 5, message = "La calificación máxima es 5")
	private Integer calificacion;

	@NotBlank(message = "El comentario no puede estar vacío")
	@Size(min = 10, max = 1000, message = "El comentario debe tener entre 10 y 1000 caracteres")
	private String comentario;

	@NotNull(message = "El ID del profesional es obligatorio")
	private Long profesionalId;

	private Long reservaId;

	// Constructor vacío
	public ResenaProfesionalCreateDTO() {
	}

	public ResenaProfesionalCreateDTO(Integer calificacion, String comentario, Long profesionalId) {
		this.calificacion = calificacion;
		this.comentario = comentario;
		this.profesionalId = profesionalId;
	}

	public ResenaProfesionalCreateDTO(Integer calificacion, String comentario, Long profesionalId, Long reservaId) {
		this.calificacion = calificacion;
		this.comentario = comentario;
		this.profesionalId = profesionalId;
		this.reservaId = reservaId;
	}

	// Getters y Setters

	public Integer getCalificacion() {
		return calificacion;
	}

	public void setCalificacion(Integer calificacion) {
		this.calificacion = calificacion;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public void setProfesionalId(Long profesionalId) {
		this.profesionalId = profesionalId;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}
}
