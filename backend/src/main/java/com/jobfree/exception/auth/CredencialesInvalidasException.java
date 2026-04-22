package com.jobfree.exception.auth;

public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException() {
        super("Credenciales incorrectas");
    }
}
