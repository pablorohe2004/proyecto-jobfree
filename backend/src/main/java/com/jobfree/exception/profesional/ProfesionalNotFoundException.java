package com.jobfree.exception.profesional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra un perfil profesional por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProfesionalNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ProfesionalNotFoundException(Long id) {
		super("Perfil profesional no encontrado con id: " + id);
	}
}
