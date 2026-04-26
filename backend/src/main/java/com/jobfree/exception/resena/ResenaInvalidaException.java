package com.jobfree.exception.resena;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ResenaInvalidaException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResenaInvalidaException(String mensaje) {
        super(mensaje);
    }
}
