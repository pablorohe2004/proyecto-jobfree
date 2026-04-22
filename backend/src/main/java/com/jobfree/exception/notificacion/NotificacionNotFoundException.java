package com.jobfree.exception.notificacion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando no se encuentra una notificación por su id.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotificacionNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public NotificacionNotFoundException(Long id) {
		super("Notificación no encontrada con id: " + id);
	}
}
