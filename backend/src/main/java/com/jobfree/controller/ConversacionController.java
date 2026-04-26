package com.jobfree.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.conversacion.ConversacionContactoCreateDTO;
import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.mapper.ConversacionMapper;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ConversacionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/conversaciones")
public class ConversacionController {

	private final ConversacionService conversacionService;

	public ConversacionController(ConversacionService conversacionService) {
		this.conversacionService = conversacionService;
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/mis")
	public ResponseEntity<List<ConversacionDTO>> misConversaciones() {
		Usuario usuario = getUsuarioAutenticado();

		List<ConversacionDTO> dtos = conversacionService.misConversaciones(usuario).stream()
				.map(ConversacionMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<ConversacionDTO> obtenerPorId(@PathVariable Long id) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.obtenerPorIdSeguro(id, usuario);
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion));
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/reserva/{reservaId}")
	public ResponseEntity<ConversacionDTO> obtenerPorReserva(@PathVariable Long reservaId) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.obtenerPorReservaSeguro(reservaId, usuario);
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/contacto")
	public ResponseEntity<ConversacionDTO> crearOObtenerContacto(@Valid @RequestBody ConversacionContactoCreateDTO dto) {
		Usuario usuario = getUsuarioAutenticado();
		Conversacion conversacion = conversacionService.crearOObtenerConversacion(usuario.getId(), dto.getProfesionalId());
		return ResponseEntity.ok(ConversacionMapper.toDTO(conversacion));
	}

	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
