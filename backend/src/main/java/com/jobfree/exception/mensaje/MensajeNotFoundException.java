package com.jobfree.exception.mensaje;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra un mensaje por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class MensajeNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public MensajeNotFoundException(Long id) {
		super("Mensaje no encontrado con id: " + id);
	}
}
