package com.jobfree.dto.resena;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para representar una reseña de un profesional.
 */
public class ResenaProfesionalDTO {

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	private Integer calificacion;

	private String comentario;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private LocalDateTime fechaCreacion;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String clienteNombre;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long clienteId;

	// Constructor vacío
	public ResenaProfesionalDTO() {
	}

	public ResenaProfesionalDTO(Long id, Integer calificacion, String comentario, LocalDateTime fechaCreacion,
			String clienteNombre, Long clienteId) {
		this.id = id;
		this.calificacion = calificacion;
		this.comentario = comentario;
		this.fechaCreacion = fechaCreacion;
		this.clienteNombre = clienteNombre;
		this.clienteId = clienteId;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public String getClienteNombre() {
		return clienteNombre;
	}

	public void setClienteNombre(String clienteNombre) {
		this.clienteNombre = clienteNombre;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}
}
