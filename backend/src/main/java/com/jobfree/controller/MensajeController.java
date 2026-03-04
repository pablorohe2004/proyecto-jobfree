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

import com.jobfree.model.entity.Mensaje;
import com.jobfree.service.MensajeService;

@CrossOrigin
@RestController
@RequestMapping("/mensajes")
public class MensajeController {

	private final MensajeService mensajeService;

	public MensajeController(MensajeService mensajeService) {
		this.mensajeService = mensajeService;
	}

	/**
	 * Devuelve todos los mensajes.
	 */
	@GetMapping
	public ResponseEntity<List<Mensaje>> listarMensajes() {
		return ResponseEntity.ok(mensajeService.listarMensajes());
	}

	/**
	 * Crea un nuevo mensaje.
	 */
	@PostMapping
	public ResponseEntity<Mensaje> crearMensaje(@RequestBody Mensaje mensaje) {
		Mensaje nuevo = mensajeService.guardarMensaje(mensaje);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
	}

}
