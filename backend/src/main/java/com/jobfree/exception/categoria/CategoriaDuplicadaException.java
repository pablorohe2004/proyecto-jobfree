package com.jobfree.exception.categoria;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando ya existe una categoría con el mismo nombre.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class CategoriaDuplicadaException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CategoriaDuplicadaException(String nombre) {
		super("Ya existe una categoría con nombre: " + nombre);
	}
}
