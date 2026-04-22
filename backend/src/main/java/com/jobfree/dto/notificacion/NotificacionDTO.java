package com.jobfree.dto.notificacion;

import java.time.LocalDateTime;

/**
 * DTO para mostrar una notificación.
 */
public class NotificacionDTO {

	private Long id;
    private String mensaje;
    private boolean leida;
    private LocalDateTime fecha;

	public NotificacionDTO() {
	}

	public NotificacionDTO(Long id, String mensaje, boolean leida, LocalDateTime fecha) {
		this.id = id;
		this.mensaje = mensaje;
		this.leida = leida;
		this.fecha = fecha;
	}

	// Getters
	
	public Long getId() {
		return id;
	}

	public String getMensaje() {
		return mensaje;
	}

	public boolean isLeida() {
		return leida;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}
	
}
