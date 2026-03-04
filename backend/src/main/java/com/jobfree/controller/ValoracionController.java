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

import com.jobfree.model.entity.Valoracion;
import com.jobfree.service.ValoracionService;

@CrossOrigin
@RestController
@RequestMapping("/valoraciones")
public class ValoracionController {

	private final ValoracionService valoracionService;

	public ValoracionController(ValoracionService valoracionService) {
		this.valoracionService = valoracionService;
	}

	/**
	 * Devuelve todas las valoraciones.
	 */
	@GetMapping
	public ResponseEntity<List<Valoracion>> listarValoraciones() {
		return ResponseEntity.ok(valoracionService.listarValoraciones());
	}

	/**
	 * Crea una nueva valoración.
	 */
	@PostMapping
	public ResponseEntity<Valoracion> crearValoracion(@RequestBody Valoracion valoracion) {
		Valoracion nueva = valoracionService.guardarValoracion(valoracion);
		return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
	}
}
