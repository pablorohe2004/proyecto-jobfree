package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.model.entity.Usuario;
import com.jobfree.service.UsuarioService;

@CrossOrigin
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	private final UsuarioService usuarioService;

	public UsuarioController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	/**
	 * Devuelve la lista de todos los usuarios registrados.
	 */
	@GetMapping
	public ResponseEntity<List<Usuario>> listarUsuarios() {
		return ResponseEntity.ok(usuarioService.listarUsuarios());
	}

	/**
	 * Crea un nuevo usuario en la base de datos.
	 */
	@PostMapping
	public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
		Usuario nuevo = usuarioService.guardarUsuario(usuario);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
	}

}
