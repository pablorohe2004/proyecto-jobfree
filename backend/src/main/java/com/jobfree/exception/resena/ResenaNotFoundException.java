package com.jobfree.exception.resena;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResenaNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResenaNotFoundException(Long id) {
        super("Reseña no encontrada con id: " + id);
    }
}
