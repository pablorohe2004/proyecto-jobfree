package com.jobfree.exception.pago;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando los datos del pago no son válidos.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PagoInvalidoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public PagoInvalidoException(String mensaje) {
		super(mensaje);
	}
}
