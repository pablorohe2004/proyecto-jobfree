package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.repository.ProfesionalInfoRepository;

@Service
public class ProfesionalInfoService {

	private final ProfesionalInfoRepository profesionalInfoRepository;

	public ProfesionalInfoService(ProfesionalInfoRepository profesionalInfoRepository) {
		this.profesionalInfoRepository = profesionalInfoRepository;
	}

	/**
	 * Devuelve todos los perfiles profesionales registrados en la base de datos.
	 *
	 * @return Lista de perfiles profesionales.
	 */
	public List<ProfesionalInfo> listarPerfiles() {
		return profesionalInfoRepository.findAll();
	}

	/**
	 * Guarda un nuevo perfil profesional.
	 *
	 * @param perfil Perfil profesional que se quiere guardar.
	 * @return Perfil profesional guardado.
	 */
	public ProfesionalInfo guardarPerfil(ProfesionalInfo perfil) {
		return profesionalInfoRepository.save(perfil);
	}

}
