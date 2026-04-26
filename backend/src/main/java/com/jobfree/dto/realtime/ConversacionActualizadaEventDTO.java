package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

import com.jobfree.dto.conversacion.ConversacionDTO;

public class ConversacionActualizadaEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final ConversacionDTO conversacion;
	private final LocalDateTime timestamp;

	public ConversacionActualizadaEventDTO(Long conversacionId, ConversacionDTO conversacion) {
		this.tipo = "conversacion.actualizada";
		this.conversacionId = conversacionId;
		this.conversacion = conversacion;
		this.timestamp = LocalDateTime.now();
	}

	public String getTipo() {
		return tipo;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public ConversacionDTO getConversacion() {
		return conversacion;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
