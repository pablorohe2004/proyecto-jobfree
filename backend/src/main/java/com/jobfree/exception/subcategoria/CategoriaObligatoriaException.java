package com.jobfree.exception.subcategoria;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se proporciona una categoría obligatoria.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CategoriaObligatoriaException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CategoriaObligatoriaException() {
		super("La categoría es obligatoria");
	}
}
