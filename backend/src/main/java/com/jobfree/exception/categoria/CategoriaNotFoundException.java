package com.jobfree.exception.categoria;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra una categoría por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class CategoriaNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CategoriaNotFoundException(Long id) {
		super("Categoría no encontrada con id: " + id);
	}
}
