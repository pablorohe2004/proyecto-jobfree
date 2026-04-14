package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.valoracion.ValoracionCreateDTO;
import com.jobfree.dto.valoracion.ValoracionDTO;
import com.jobfree.mapper.ValoracionMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.entity.Valoracion;
import com.jobfree.service.ProfesionalInfoService;
import com.jobfree.service.ReservaService;
import com.jobfree.service.ValoracionService;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/valoraciones")
public class ValoracionController {

	private final ValoracionService valoracionService;
	private final ReservaService reservaService;
	private final ProfesionalInfoService profesionalService;

	public ValoracionController(ValoracionService valoracionService, ReservaService reservaService,
			ProfesionalInfoService profesionalService) {
		this.valoracionService = valoracionService;
		this.reservaService = reservaService;
		this.profesionalService = profesionalService;
	}

	/**
	 * Obtiene todas las valoraciones registradas en el sistema.
	 *
	 * @return lista de valoraciones en formato DTO
	 */
	@GetMapping
	public ResponseEntity<List<ValoracionDTO>> listarValoraciones() {

		List<ValoracionDTO> dtos = valoracionService.listarValoraciones().stream().map(ValoracionMapper::toDTO)
				.toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene una valoración por su identificador.
	 *
	 * @param id identificador de la valoración
	 * @return valoración encontrada en formato DTO
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ValoracionDTO> obtenerPorId(@PathVariable Long id) {

		return ResponseEntity.ok(ValoracionMapper.toDTO(valoracionService.obtenerPorId(id)));
	}

	/**
	 * Obtiene la media de valoraciones de un profesional.
	 *
	 * @param profesionalId identificador del profesional
	 * @return media de valoraciones del profesional
	 */
	@GetMapping("/profesionales/{profesionalId}/media")
	public ResponseEntity<Double> obtenerMedia(@PathVariable Long profesionalId) {
		return ResponseEntity.ok(valoracionService.obtenerMediaProfesional(profesionalId));
	}

	/**
	 * Obtiene el número total de valoraciones de un profesional.
	 *
	 * @param profesionalId identificador del profesional
	 * @return número total de valoraciones del profesional
	 */
	@GetMapping("/profesionales/{profesionalId}/total")
	public ResponseEntity<Long> contar(@PathVariable Long profesionalId) {
		return ResponseEntity.ok(valoracionService.contarValoracionesProfesional(profesionalId));
	}

	/**
	 * Crea una nueva valoración asociada a una reserva y a un profesional. El
	 * cliente se obtiene del usuario autenticado.
	 *
	 * @param dto datos necesarios para crear la valoración
	 * @return valoración creada en formato DTO
	 */
	@PreAuthorize("hasRole('CLIENTE')")
	@PostMapping
	public ResponseEntity<ValoracionDTO> crearValoracion(@Valid @RequestBody ValoracionCreateDTO dto) {

		Reserva reserva = reservaService.obtenerPorId(dto.getReservaId());
		Usuario cliente = getUsuarioAutenticado();
		ProfesionalInfo profesional = profesionalService.obtenerPorId(dto.getProfesionalId());

		Valoracion nueva = valoracionService
				.crearValoracion(ValoracionMapper.toEntity(dto, reserva, cliente, profesional));

		return ResponseEntity.status(HttpStatus.CREATED).body(ValoracionMapper.toDTO(nueva));
	}

	/**
	 * Elimina una valoración por su identificador.
	 *
	 * @param id identificador de la valoración
	 * @return respuesta sin contenido (204 No Content)
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarValoracion(@PathVariable Long id) {
		valoracionService.eliminarValoracion(id);

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
