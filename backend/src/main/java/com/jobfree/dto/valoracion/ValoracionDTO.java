package com.jobfree.dto.valoracion;

import java.time.LocalDateTime;

/**
 * DTO para mostrar los datos de una valoración.
 */
public class ValoracionDTO {

	private Long id;
	private Integer estrellas;
	private String comentario;
	private LocalDateTime fecha;

	private Long reservaId;
	private Long clienteId;
	private Long profesionalId;

	public ValoracionDTO() {
	}

	public ValoracionDTO(Long id, Integer estrellas, String comentario, LocalDateTime fecha, Long reservaId,
			Long clienteId, Long profesionalId) {
		this.id = id;
		this.estrellas = estrellas;
		this.comentario = comentario;
		this.fecha = fecha;
		this.reservaId = reservaId;
		this.clienteId = clienteId;
		this.profesionalId = profesionalId;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public Integer getEstrellas() {
		return estrellas;
	}

	public String getComentario() {
		return comentario;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

}
