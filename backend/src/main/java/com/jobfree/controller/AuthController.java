package com.jobfree.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.auth.LoginDTO;
import com.jobfree.service.AuthService;

import jakarta.validation.Valid;

/**
 * Controlador encargado de la autenticación. Expone endpoints relacionados con
 * login.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	/**
	 * Endpoint de login.
	 * Recibe email y contraseña y devuelve un token JWT.
	 *
	 * @param dto datos de login (email y password)
	 * @return token JWT si las credenciales son correctas
	 */
	@PostMapping("/login")
	public ResponseEntity<String> login(@Valid @RequestBody LoginDTO dto) {

		// Llamar al servicio para validar credenciales
		String token = authService.login(dto.getEmail(), dto.getPassword());

		// Devolver el token al cliente
		return ResponseEntity.ok(token);
	}
}
