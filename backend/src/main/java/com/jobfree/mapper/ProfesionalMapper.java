package com.jobfree.mapper;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ProfesionalDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad ProfesionalInfo y sus DTOs.
 */
public class ProfesionalMapper {

	/**
	 * Convierte una entidad ProfesionalInfo a su DTO de salida.
	 *
	 * @param p entidad profesional
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static ProfesionalDTO toDTO(ProfesionalInfo p) {
		return new ProfesionalDTO(p.getId(), p.getDescripcion(), p.getExperiencia(), p.getNombreEmpresa(), p.getCif(),
				p.getPlan(), p.getValoracionMedia(), p.getNumeroValoraciones(), p.getUsuario().getId());
	}

	/**
	 * Convierte un DTO de creación a entidad ProfesionalInfo.
	 *
	 * @param dto     datos de entrada
	 * @param usuario usuario asociado
	 * @return entidad lista para persistir
	 */
	public static ProfesionalInfo toEntity(ProfesionalCreateDTO dto, Usuario usuario) {

		ProfesionalInfo p = new ProfesionalInfo();

		p.setDescripcion(dto.getDescripcion());
		p.setExperiencia(dto.getExperiencia());
		p.setNombreEmpresa(dto.getNombreEmpresa());
		
		if (dto.getCif() != null) {
			p.setCif(dto.getCif().trim().toUpperCase());
		}
		
		p.setPlan(dto.getPlan());

		p.setUsuario(usuario);

		return p;
	}
}