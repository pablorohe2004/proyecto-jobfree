package com.jobfree.exception.profesional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando los datos del profesional no son válidos.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProfesionalInvalidoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ProfesionalInvalidoException(String mensaje) {
		super(mensaje);
	}
}