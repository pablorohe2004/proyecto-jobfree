package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

public class MensajeLeidoEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final Long mensajeId;
	private final Long lectorId;
	private final LocalDateTime timestamp;

	public MensajeLeidoEventDTO(Long conversacionId, Long mensajeId, Long lectorId) {
		this.tipo = "mensaje.leido";
		this.conversacionId = conversacionId;
		this.mensajeId = mensajeId;
		this.lectorId = lectorId;
		this.timestamp = LocalDateTime.now();
	}

	public String getTipo() {
		return tipo;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public Long getMensajeId() {
		return mensajeId;
	}

	public Long getLectorId() {
		return lectorId;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
