package com.jobfree.exception.usuario;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando el email o teléfono ya existe.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class UsuarioDuplicadoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UsuarioDuplicadoException(String campo) {
		super("El " + campo + " ya está en uso");
	}
}
