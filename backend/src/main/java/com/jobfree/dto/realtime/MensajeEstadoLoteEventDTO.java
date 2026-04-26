package com.jobfree.dto.realtime;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class MensajeEstadoLoteEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final List<Long> mensajeIds;
	private final List<MensajeEstadoDTO> mensajes;
	private final Long usuarioId;
	private final LocalDateTime timestamp;

	public MensajeEstadoLoteEventDTO(String tipo, Long conversacionId, List<MensajeEstadoDTO> mensajes, Long usuarioId) {
		this.tipo = tipo;
		this.conversacionId = conversacionId;
		this.mensajes = mensajes;
		this.mensajeIds = mensajes.stream().map(MensajeEstadoDTO::getId).collect(Collectors.toList());
		this.usuarioId = usuarioId;
		this.timestamp = LocalDateTime.now();
	}

	public String getTipo() {
		return tipo;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public List<Long> getMensajeIds() {
		return mensajeIds;
	}

	public List<MensajeEstadoDTO> getMensajes() {
		return mensajes;
	}

	public Long getUsuarioId() {
		return usuarioId;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
