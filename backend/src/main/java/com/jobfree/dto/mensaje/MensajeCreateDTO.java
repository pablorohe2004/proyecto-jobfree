package com.jobfree.dto.mensaje;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear un mensaje.
 */
public class MensajeCreateDTO {

	@NotBlank
	@Size(min = 1, max = 1000, message = "El mensaje debe tener entre 1 y 1000 caracteres")
    private String contenido;
	
    @NotNull
    private Long destinatarioId;

    @NotNull
    private Long reservaId;

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public Long getDestinatarioId() {
		return destinatarioId;
	}

	public void setDestinatarioId(Long destinatarioId) {
		this.destinatarioId = destinatarioId;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}
    
    
}
