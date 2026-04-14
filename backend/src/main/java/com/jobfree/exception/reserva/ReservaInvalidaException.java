package com.jobfree.exception.reserva;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando los datos de la reserva no son válidos.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ReservaInvalidaException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ReservaInvalidaException(String mensaje) {
		super(mensaje);
	}
}
