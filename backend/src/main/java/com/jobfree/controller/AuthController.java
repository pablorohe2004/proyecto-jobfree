package com.jobfree.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.auth.LoginDTO;
import com.jobfree.dto.usuario.UsuarioDTO;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.AuthService;

import jakarta.validation.Valid;

/**
 * Controlador encargado de la autenticación. Expone endpoints relacionados con
 * login y consulta del usuario activo.
 */
@CrossOrigin
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

	/**
	 * Devuelve los datos del usuario que tiene la sesión activa.
	 * El filtro JWT ya ha identificado al usuario antes de llegar aquí,
	 * así que solo hay que sacarlo del contexto de seguridad de Spring.
	 *
	 * @return datos básicos del usuario (id, nombre, email, rol...)
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/me")
	public ResponseEntity<UsuarioDTO> getMe() {

		// El filtro JWT mete el Usuario en el contexto al validar el token
		Usuario usuario = (Usuario) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		return ResponseEntity.ok(UsuarioMapper.toDTO(usuario));
	}
}
