package com.jobfree.exception.valoracion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando los datos de la valoración no son válidos.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValoracionInvalidaException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ValoracionInvalidaException(String mensaje) {
		super(mensaje);
	}
}
