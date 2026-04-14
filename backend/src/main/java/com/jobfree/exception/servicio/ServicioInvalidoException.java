package com.jobfree.exception.servicio;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando los datos del servicio no son válidos.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ServicioInvalidoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ServicioInvalidoException(String mensaje) {
		super(mensaje);
	}
}
