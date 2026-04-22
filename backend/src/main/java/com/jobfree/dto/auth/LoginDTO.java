package com.jobfree.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para el login de usuario (email y contraseña).
 */
public class LoginDTO {

	@NotBlank
	@Email
	private String email;

	@NotBlank
	private String password;

	// Getters y Setters

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
