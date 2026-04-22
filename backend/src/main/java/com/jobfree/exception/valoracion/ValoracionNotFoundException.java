package com.jobfree.exception.valoracion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra una valoración por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ValoracionNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ValoracionNotFoundException(Long id) {
		super("Valoración no encontrada con id: " + id);
	}
}
