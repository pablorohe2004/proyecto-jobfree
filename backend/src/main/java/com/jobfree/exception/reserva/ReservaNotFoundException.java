package com.jobfree.exception.reserva;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra una reserva por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ReservaNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ReservaNotFoundException(Long id) {
		super("Reserva no encontrada con id: " + id);
	}
}
