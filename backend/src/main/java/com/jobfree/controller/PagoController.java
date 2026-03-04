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

import com.jobfree.model.entity.Pago;
import com.jobfree.service.PagoService;

@CrossOrigin
@RestController
@RequestMapping("/pagos")
public class PagoController {

	private final PagoService pagoService;

	public PagoController(PagoService pagoService) {
		this.pagoService = pagoService;
	}

	/**
	 * Devuelve todos los pagos.
	 */
	@GetMapping
	public ResponseEntity<List<Pago>> listarPagos() {
		return ResponseEntity.ok(pagoService.listarPagos());
	}

	/**
	 * Crea un nuevo pago.
	 */
	@PostMapping
	public ResponseEntity<Pago> crearPago(@RequestBody Pago pago) {
		Pago nuevo = pagoService.guardarPago(pago);
		return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
	}
}
