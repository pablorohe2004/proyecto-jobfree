package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.mapper.MensajeMapper;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.MensajeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/mensajes")
public class MensajeController {

	private final MensajeService mensajeService;

	public MensajeController(MensajeService mensajeService) {
		this.mensajeService = mensajeService;
	}

	/**
	 * Obtiene todos los mensajes del sistema (solo ADMIN).
	 *
	 * @return lista de mensajes en formato DTO
	 */
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<MensajeDTO>> listarMensajes() {

		List<MensajeDTO> dtos = mensajeService.listarMensajes().stream().map(MensajeMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene los mensajes de una conversación (reserva) si el usuario autenticado
	 * tiene acceso a ella.
	 *
	 * @param reservaId identificador de la reserva
	 * @return lista de mensajes en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/reservas/{reservaId}")
	public ResponseEntity<List<MensajeDTO>> obtenerPorReserva(@PathVariable Long reservaId) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<MensajeDTO> dtos = mensajeService.obtenerPorReserva(reservaId, usuario).stream().map(MensajeMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Crea un nuevo mensaje. El remitente se obtiene del usuario autenticado.
	 *
	 * @param dto datos del mensaje
	 * @return mensaje creado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public ResponseEntity<MensajeDTO> crearMensaje(@Valid @RequestBody MensajeCreateDTO dto) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Mensaje nuevo = mensajeService.crear(dto, usuario);

		return ResponseEntity.status(HttpStatus.CREATED).body(MensajeMapper.toDTO(nuevo));
	}

	/**
	 * Marca un mensaje como leído. Solo el destinatario puede hacerlo.
	 *
	 * @param id identificador del mensaje
	 * @return mensaje actualizado en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/leido")
	public ResponseEntity<MensajeDTO> marcarComoLeido(@PathVariable Long id) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Mensaje actualizado = mensajeService.marcarComoLeido(id, usuario);

		return ResponseEntity.ok(MensajeMapper.toDTO(actualizado));
	}
}
