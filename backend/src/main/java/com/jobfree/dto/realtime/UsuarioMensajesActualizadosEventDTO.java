package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

public class UsuarioMensajesActualizadosEventDTO {

	private final String tipo;
	private final Long conversacionId;
	private final String actualizacionTipo;
	private final MensajeEstadoLoteEventDTO actualizacion;
	private final LocalDateTime timestamp;

	public UsuarioMensajesActualizadosEventDTO(MensajeEstadoLoteEventDTO actualizacion) {
		this.tipo = "usuario.mensajes.actualizados";
		this.conversacionId = actualizacion.getConversacionId();
		this.actualizacionTipo = actualizacion.getTipo();
		this.actualizacion = actualizacion;
		this.timestamp = LocalDateTime.now();
	}

	public String getTipo() {
		return tipo;
	}

	public Long getConversacionId() {
		return conversacionId;
	}

	public String getActualizacionTipo() {
		return actualizacionTipo;
	}

	public MensajeEstadoLoteEventDTO getActualizacion() {
		return actualizacion;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
