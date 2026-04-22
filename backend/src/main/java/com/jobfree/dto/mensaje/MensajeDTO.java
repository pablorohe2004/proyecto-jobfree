package com.jobfree.dto.mensaje;

import java.time.LocalDateTime;

/**
 * DTO para mostrar un mensaje.
 */
public class MensajeDTO {

	private Long id;
	private String contenido;
	private boolean leido;
	private LocalDateTime fechaEnvio;

	private Long remitenteId;
	private Long destinatarioId;
	private Long reservaId;

	public MensajeDTO() {
	}

	public MensajeDTO(Long id, String contenido, boolean leido, LocalDateTime fechaEnvio, Long remitenteId,
			Long destinatarioId, Long reservaId) {
		this.id = id;
		this.contenido = contenido;
		this.leido = leido;
		this.fechaEnvio = fechaEnvio;
		this.remitenteId = remitenteId;
		this.destinatarioId = destinatarioId;
		this.reservaId = reservaId;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public String getContenido() {
		return contenido;
	}

	public boolean isLeido() {
		return leido;
	}

	public LocalDateTime getFechaEnvio() {
		return fechaEnvio;
	}

	public Long getRemitenteId() {
		return remitenteId;
	}

	public Long getDestinatarioId() {
		return destinatarioId;
	}

	public Long getReservaId() {
		return reservaId;
	}

}
