package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.reserva.ReservaCreateDTO;
import com.jobfree.dto.reserva.ReservaDTO;
import com.jobfree.mapper.ReservaMapper;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ReservaService;
import com.jobfree.service.ServicioOfrecidoService;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/reservas")
public class ReservaController {

	private final ReservaService reservaService;
	private final ServicioOfrecidoService servicioService;

	public ReservaController(ReservaService reservaService, ServicioOfrecidoService servicioService) {
		this.reservaService = reservaService;
		this.servicioService = servicioService;
	}

	/**
	 * Obtiene todas las reservas registradas en el sistema.
	 *
	 * @return lista de reservas en formato DTO
	 */
	@GetMapping
	public ResponseEntity<List<ReservaDTO>> listarReservas() {

		List<ReservaDTO> dtos = reservaService.listarReservas().stream().map(ReservaMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene una reserva por su ID validando que el usuario tenga acceso.
	 *
	 * @param id identificador de la reserva
	 * @return reserva encontrada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<ReservaDTO> obtenerPorId(@PathVariable Long id) {

		Usuario usuario = getUsuarioAutenticado();

		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);

		return ResponseEntity.ok(ReservaMapper.toDTO(reserva));
	}

	/**
	 * Crea una nueva reserva para el usuario autenticado.
	 *
	 * @param dto datos necesarios para la creación
	 * @return reserva creada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<ReservaDTO> crearReserva(@Valid @RequestBody ReservaCreateDTO dto) {

		Usuario cliente = getUsuarioAutenticado();

		ServicioOfrecido servicio = servicioService.obtenerPorId(dto.getServicioId());

		Reserva nueva = reservaService.crearReserva(ReservaMapper.toEntity(dto, cliente, servicio));

		return ResponseEntity.status(HttpStatus.CREATED).body(ReservaMapper.toDTO(nueva));
	}

	/**
	 * Confirma una reserva pendiente.
	 *
	 * @param id identificador de la reserva
	 * @return reserva confirmada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/confirmar")
	public ResponseEntity<ReservaDTO> confirmarReserva(@PathVariable Long id) {

		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);

		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.confirmarReserva(reserva)));
	}

	/**
	 * Cancela una reserva existente.
	 *
	 * @param id identificador de la reserva
	 * @return reserva cancelada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<ReservaDTO> cancelarReserva(@PathVariable Long id) {

		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);

		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.cancelarReserva(reserva)));
	}

	/**
	 * Marca una reserva como completada.
	 *
	 * @param id identificador de la reserva
	 * @return reserva completada en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/completar")
	public ResponseEntity<ReservaDTO> completarReserva(@PathVariable Long id) {

		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);

		return ResponseEntity.ok(ReservaMapper.toDTO(reservaService.completarReserva(reserva)));
	}

	/**
	 * Elimina una reserva si el usuario tiene permisos.
	 *
	 * @param id identificador de la reserva
	 * @return respuesta sin contenido (204)
	 */
	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {

		Usuario usuario = getUsuarioAutenticado();
		Reserva reserva = reservaService.obtenerPorIdSeguro(id, usuario);

		reservaService.eliminarReserva(reserva);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Obtiene el usuario autenticado desde el contexto de seguridad.
	 *
	 * @return usuario autenticado
	 */
	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
