package com.jobfree.dto.notificacion;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para crear una notificación.
 */
public class NotificacionCreateDTO {

    @NotBlank
    private String mensaje;

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}    
    
}
