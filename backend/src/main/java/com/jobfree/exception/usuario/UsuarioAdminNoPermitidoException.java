package com.jobfree.exception.usuario;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando se intenta crear un usuario ADMIN.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UsuarioAdminNoPermitidoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UsuarioAdminNoPermitidoException() {
		super("No se puede crear un administrador");
	}
}
