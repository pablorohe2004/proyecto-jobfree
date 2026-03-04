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

import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.service.ServicioOfrecidoService;

@CrossOrigin
@RestController
@RequestMapping("/servicios")
public class ServicioOfrecidoController {

	private final ServicioOfrecidoService servicioService;

	public ServicioOfrecidoController(ServicioOfrecidoService servicioService) {
		this.servicioService = servicioService;
	}

	/**
	 * Devuelve la lista de todos los servicios ofrecidos.
	 */
	@GetMapping
	public ResponseEntity<List<ServicioOfrecido>> listarServicios() {
		return ResponseEntity.ok(servicioService.listarServicios());
	}

	/**
	 * Crea un nuevo servicio ofrecido.
	 */
	@PostMapping
	public ResponseEntity<ServicioOfrecido> crearServicio(@RequestBody ServicioOfrecido servicio) {
		ServicioOfrecido nuevo = servicioService.guardarServicio(servicio);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
	}
}
