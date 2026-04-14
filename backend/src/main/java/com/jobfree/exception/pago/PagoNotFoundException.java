package com.jobfree.exception.pago;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra un pago por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class PagoNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public PagoNotFoundException(Long id) {
		super("Pago no encontrado con id: " + id);
	}
}
