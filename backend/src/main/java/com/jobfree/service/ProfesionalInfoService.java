package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.exception.profesional.ProfesionalInvalidoException;
import com.jobfree.exception.profesional.ProfesionalNotFoundException;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.ProfesionalInfoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProfesionalInfoService {

	private final ProfesionalInfoRepository profesionalInfoRepository;

	public ProfesionalInfoService(ProfesionalInfoRepository profesionalInfoRepository) {
		this.profesionalInfoRepository = profesionalInfoRepository;
	}

	/**
	 * Obtiene todos los perfiles profesionales registrados en la base de datos.
	 *
	 * @return lista de perfiles profesionales
	 */
	public List<ProfesionalInfo> listarPerfiles() {
		return profesionalInfoRepository.findAll();
	}

	/**
	 * Busca un perfil profesional por su ID.
	 *
	 * @param id identificador del perfil
	 * @return perfil encontrado
	 * @throws ProfesionalNotFoundException si no existe el perfil
	 */
	public ProfesionalInfo obtenerPorId(Long id) {
		return profesionalInfoRepository.findById(id).orElseThrow(() -> new ProfesionalNotFoundException(id));
	}

	/**
	 * Guarda un nuevo perfil profesional validando duplicados.
	 *
	 * @param perfil datos del perfil a registrar
	 * @return perfil guardado correctamente
	 * @throws ProfesionalInvalidoException si el usuario ya tiene perfil o el CIF
	 *                                      está duplicado
	 */
	public ProfesionalInfo guardarPerfil(ProfesionalInfo perfil) {

		if (perfil.getUsuario() == null) {
			throw new ProfesionalInvalidoException("El usuario es obligatorio");
		}

		if (profesionalInfoRepository.findByUsuarioId(perfil.getUsuario().getId()).isPresent()) {
			throw new ProfesionalInvalidoException("El usuario ya tiene un perfil profesional");
		}

		if (perfil.getCif() != null && !perfil.getCif().isBlank()) {

			String cifNormalizado = perfil.getCif().trim().toUpperCase();

			if (profesionalInfoRepository.existsByCif(cifNormalizado)) {
				throw new ProfesionalInvalidoException("El CIF ya está registrado");
			}

			perfil.setCif(cifNormalizado);
		}

		return profesionalInfoRepository.save(perfil);
	}

	/**
	 * Actualiza el perfil profesional del usuario autenticado. Solo el propietario
	 * del perfil puede realizar modificaciones.
	 *
	 * @param id      identificador del perfil profesional a actualizar
	 * @param dto     datos nuevos del perfil (pueden ser parciales)
	 * @param usuario usuario autenticado que realiza la operación
	 * @return perfil profesional actualizado
	 * @throws ProfesionalNotFoundException si el perfil no existe
	 * @throws ProfesionalInvalidoException si el usuario no es el propietario o el
	 *                                      CIF está duplicado
	 */
	public ProfesionalInfo actualizarPerfil(Long id, ProfesionalCreateDTO dto, Usuario usuario) {

		ProfesionalInfo existente = obtenerPorId(id);

		// Seguridad: solo el dueño puede editar su perfil
		if (!existente.getUsuario().getId().equals(usuario.getId())) {
			throw new ProfesionalInvalidoException("No puedes modificar este perfil");
		}

		if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
			existente.setDescripcion(dto.getDescripcion());
		}

		if (dto.getExperiencia() != null && dto.getExperiencia() >= 0) {
			existente.setExperiencia(dto.getExperiencia());
		}

		if (dto.getNombreEmpresa() != null) {
			existente.setNombreEmpresa(dto.getNombreEmpresa());
		}

		if (dto.getCif() != null && !dto.getCif().isBlank()) {

			String cifNormalizado = dto.getCif().trim().toUpperCase();

			if (!cifNormalizado.equals(existente.getCif()) && profesionalInfoRepository.existsByCif(cifNormalizado)) {

				throw new ProfesionalInvalidoException("El CIF ya está registrado");
			}

			existente.setCif(cifNormalizado);
		}

		if (dto.getPlan() != null) {
			existente.setPlan(dto.getPlan());
		}

		return profesionalInfoRepository.save(existente);
	}

	/**
	 * Obtiene el perfil profesional de un usuario.
	 *
	 * @param usuarioId identificador del usuario
	 * @return perfil profesional
	 * @throws ProfesionalNotFoundException si no existe
	 */
	public ProfesionalInfo obtenerPorUsuario(Long usuarioId) {

		return profesionalInfoRepository.findByUsuarioId(usuarioId)
				.orElseThrow(() -> new ProfesionalNotFoundException(usuarioId));
	}

	public void eliminarPerfil(Long id) {

		ProfesionalInfo perfil = obtenerPorId(id);

		profesionalInfoRepository.delete(perfil);
	}
}