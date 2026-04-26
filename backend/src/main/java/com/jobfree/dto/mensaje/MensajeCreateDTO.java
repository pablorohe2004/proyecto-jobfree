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
    private Long conversacionId;

	@NotBlank
	@Size(min = 1, max = 36, message = "El identificador del cliente debe tener entre 1 y 36 caracteres")
	private String clientMessageId;

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

	public Long getConversacionId() {
		return conversacionId;
	}

	public void setConversacionId(Long conversacionId) {
		this.conversacionId = conversacionId;
	}

	public String getClientMessageId() {
		return clientMessageId;
	}

	public void setClientMessageId(String clientMessageId) {
		this.clientMessageId = clientMessageId;
	}
}
