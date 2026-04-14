package com.jobfree.exception.usuario;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando el usuario no existe.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UsuarioNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UsuarioNotFoundException(Long id) {
		super("Usuario no encontrado con id: " + id);
	}
}
