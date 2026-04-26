package com.jobfree.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.favorito.FavoritoServicioCreateDTO;
import com.jobfree.dto.favorito.FavoritoServicioDTO;
import com.jobfree.mapper.FavoritoServicioMapper;
import com.jobfree.model.entity.FavoritoServicio;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.FavoritoServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/favoritos")
@PreAuthorize("hasRole('CLIENTE')")
public class FavoritoServicioController {

	private final FavoritoServicioService favoritoService;

	public FavoritoServicioController(FavoritoServicioService favoritoService) {
		this.favoritoService = favoritoService;
	}

	@GetMapping
	public ResponseEntity<List<FavoritoServicioDTO>> listarMisFavoritos() {
		Usuario cliente = getUsuarioAutenticado();
		List<FavoritoServicioDTO> dtos = favoritoService.listarPorCliente(cliente)
				.stream()
				.map(FavoritoServicioMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	@GetMapping("/servicio/{servicioId}/estado")
	public ResponseEntity<Map<String, Boolean>> comprobarEstado(@PathVariable Long servicioId) {
		Usuario cliente = getUsuarioAutenticado();
		return ResponseEntity.ok(Map.of("esFavorito", favoritoService.esFavorito(servicioId, cliente)));
	}

	@PostMapping
	public ResponseEntity<FavoritoServicioDTO> crearFavorito(@Valid @RequestBody FavoritoServicioCreateDTO dto) {
		Usuario cliente = getUsuarioAutenticado();
		FavoritoServicio favorito = favoritoService.crearFavorito(dto.getServicioId(), cliente);
		return ResponseEntity.status(HttpStatus.CREATED).body(FavoritoServicioMapper.toDTO(favorito));
	}

	@DeleteMapping("/servicio/{servicioId}")
	public ResponseEntity<Void> eliminarFavorito(@PathVariable Long servicioId) {
		Usuario cliente = getUsuarioAutenticado();
		favoritoService.eliminarFavorito(servicioId, cliente);
		return ResponseEntity.noContent().build();
	}

	private Usuario getUsuarioAutenticado() {
		return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
