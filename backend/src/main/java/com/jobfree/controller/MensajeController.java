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

import com.jobfree.dto.mensaje.MensajeBatchUpdateDTO;
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
	 * Obtiene los mensajes de una conversación si el usuario autenticado
	 * tiene acceso a ella.
	 *
	 * @param conversacionId identificador de la conversación
	 * @return lista de mensajes en formato DTO
	 */
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/conversaciones/{conversacionId}")
	public ResponseEntity<List<MensajeDTO>> obtenerPorConversacion(@PathVariable Long conversacionId) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<MensajeDTO> dtos = mensajeService.obtenerPorConversacion(conversacionId, usuario).stream().map(MensajeMapper::toDTO)
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

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/recibido")
	public ResponseEntity<MensajeDTO> marcarComoRecibido(@PathVariable Long id) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Mensaje actualizado = mensajeService.marcarComoRecibido(id, usuario);

		return ResponseEntity.ok(MensajeMapper.toDTO(actualizado));
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/recibido/lote")
	public ResponseEntity<List<MensajeDTO>> marcarComoRecibidoBatch(@Valid @RequestBody MensajeBatchUpdateDTO dto) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<MensajeDTO> actualizados = mensajeService.marcarComoRecibidoBatch(dto, usuario).stream()
				.map(MensajeMapper::toDTO)
				.toList();

		return ResponseEntity.ok(actualizados);
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/leido/lote")
	public ResponseEntity<List<MensajeDTO>> marcarComoLeidoBatch(@Valid @RequestBody MensajeBatchUpdateDTO dto) {

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<MensajeDTO> actualizados = mensajeService.marcarComoLeidoBatch(dto, usuario).stream()
				.map(MensajeMapper::toDTO)
				.toList();

		return ResponseEntity.ok(actualizados);
	}
}
