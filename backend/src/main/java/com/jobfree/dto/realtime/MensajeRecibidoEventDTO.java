package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

public class MensajeRecibidoEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final Long mensajeId;
	private final Long receptorId;
	private final LocalDateTime timestamp;

	public MensajeRecibidoEventDTO(Long conversacionId, Long mensajeId, Long receptorId) {
		this.tipo = "mensaje.recibido";
		this.conversacionId = conversacionId;
		this.mensajeId = mensajeId;
		this.receptorId = receptorId;
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

	public Long getReceptorId() {
		return receptorId;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
