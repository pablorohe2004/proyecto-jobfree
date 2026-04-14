package com.jobfree.exception.subcategoria;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra una subcategoría por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class SubcategoriaNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public SubcategoriaNotFoundException(Long id) {
		super("Subcategoría no encontrada con id: " + id);
	}
}
