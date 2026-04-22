package com.jobfree.exception.auth;

public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException() {
        super("El enlace de recuperación no es válido o ya fue utilizado");
    }
}
