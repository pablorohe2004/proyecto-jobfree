package com.jobfree.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordDTO {

    @NotBlank(message = "El token es obligatorio")
    private String token;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String nuevaPassword;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
}
