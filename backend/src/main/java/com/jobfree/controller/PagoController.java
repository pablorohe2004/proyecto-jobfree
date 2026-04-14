package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.pago.PagoCreateDTO;
import com.jobfree.dto.pago.PagoDTO;
import com.jobfree.mapper.PagoMapper;
import com.jobfree.model.entity.Pago;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.PagoService;
import com.jobfree.service.ReservaService;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/pagos")
public class PagoController {

	private final PagoService pagoService;
	private final ReservaService reservaService;

	public PagoController(PagoService pagoService, ReservaService reservaService) {
		this.pagoService = pagoService;
		this.reservaService = reservaService;
	}

	/**
	 * Obtiene todos los pagos del sistema (solo ADMIN).
	 *
	 * @return lista de pagos en formato DTO
	 */
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<PagoDTO>> listarPagos() {
		List<PagoDTO> dtos = pagoService.listarPagos().stream().map(PagoMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene un pago por su identificador.
	 *
	 * @param id identificador del pago
	 * @return pago encontrado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<PagoDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(PagoMapper.toDTO(pagoService.obtenerPorId(id)));
	}

	/**
	 * Obtiene el pago asociado a una reserva si el usuario autenticado tiene acceso
	 * a dicha reserva.
	 *
	 * @param reservaId identificador de la reserva
	 * @return pago encontrado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/reservas/{reservaId}")
	public ResponseEntity<PagoDTO> obtenerPorReserva(@PathVariable Long reservaId) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return ResponseEntity.ok(PagoMapper.toDTO(pagoService.obtenerPorReserva(reservaId, usuario)));
	}

	/**
	 * Crea un pago en estado PENDIENTE. En un entorno real, este endpoint
	 * representaría la creación de una intención de pago (payment intent).
	 *
	 * @param dto datos necesarios para crear el pago
	 * @return pago creado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<PagoDTO> crearPago(@Valid @RequestBody PagoCreateDTO dto) {

		Reserva reserva = reservaService.obtenerPorId(dto.getReservaId());

		Pago nuevo = pagoService.guardarPago(PagoMapper.toEntity(dto, reserva));

		return ResponseEntity.status(HttpStatus.CREATED).body(PagoMapper.toDTO(nuevo));
	}
}