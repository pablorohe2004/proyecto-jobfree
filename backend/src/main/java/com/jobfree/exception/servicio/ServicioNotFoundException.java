package com.jobfree.exception.servicio;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra un servicio por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ServicioNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ServicioNotFoundException(Long id) {
		super("Servicio no encontrado con id: " + id);
	}
}
