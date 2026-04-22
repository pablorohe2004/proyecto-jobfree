package com.jobfree.exception.auth;

public class TokenExpiradoException extends RuntimeException {

    public TokenExpiradoException() {
        super("El enlace de recuperación ha caducado. Solicita uno nuevo.");
    }
}
