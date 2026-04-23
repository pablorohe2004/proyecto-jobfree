package com.jobfree.dto.realtime;

import java.time.LocalDateTime;

public class MensajeEstadoDTO {

	private final Long id;
	private final boolean leido;
	private final boolean recibido;
	private final LocalDateTime timestamp;

	public MensajeEstadoDTO(Long id, boolean leido, boolean recibido, LocalDateTime timestamp) {
		this.id = id;
		this.leido = leido;
		this.recibido = recibido;
		this.timestamp = timestamp;
	}

	public Long getId() {
		return id;
	}

	public boolean isLeido() {
		return leido;
	}

	public boolean isRecibido() {
		return recibido;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}
