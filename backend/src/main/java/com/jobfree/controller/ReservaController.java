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

import com.jobfree.model.entity.Reserva;
import com.jobfree.service.ReservaService;

@CrossOrigin
@RestController
@RequestMapping("/reservas")
public class ReservaController {

	private final ReservaService reservaService;

	public ReservaController(ReservaService reservaService) {
		this.reservaService = reservaService;
	}

	/**
	 * Devuelve todas las reservas.
	 */
	@GetMapping
	public ResponseEntity<List<Reserva>> listarReservas() {
		return ResponseEntity.ok(reservaService.listarReservas());
	}

	/**
	 * Crea una nueva reserva.
	 */
	@PostMapping
	public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {
		Reserva nueva = reservaService.guardarReserva(reserva);
		return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
	}

}
