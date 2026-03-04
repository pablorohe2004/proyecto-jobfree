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

import com.jobfree.model.entity.Notificacion;
import com.jobfree.service.NotificacionService;

@CrossOrigin
@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

	private final NotificacionService notificacionService;

	public NotificacionController(NotificacionService notificacionService) {
		this.notificacionService = notificacionService;
	}

	/**
	 * Devuelve todas las notificaciones registradas.
	 */
	@GetMapping
	public ResponseEntity<List<Notificacion>> listarNotificaciones() {
		return ResponseEntity.ok(notificacionService.listarNotificaciones());
	}

	/**
	 * Crea una nueva notificacion.
	 */
	@PostMapping
	public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
		Notificacion nueva = notificacionService.guardarNotificacion(notificacion);
		return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
	}
}
