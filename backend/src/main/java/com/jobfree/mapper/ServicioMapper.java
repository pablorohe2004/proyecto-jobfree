package com.jobfree.mapper;

import com.jobfree.dto.servicio.ServicioCreateDTO;
import com.jobfree.dto.servicio.ServicioDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.SubcategoriaServicio;

/**
 * Mapper para convertir entre la entidad ServicioOfrecido y sus DTOs.
 */
public class ServicioMapper {

	/**
	 * Convierte una entidad ServicioOfrecido a su DTO de salida.
	 *
	 * @param s entidad servicio
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static ServicioDTO toDTO(ServicioOfrecido s) {
		return new ServicioDTO(s.getId(), s.getTitulo(), s.getDescripcion(), s.getDuracionMin(), s.getPrecioHora(),
				s.isActiva(), s.getSubcategoria().getId());
	}

	/**
	 * Convierte un DTO de creación a entidad ServicioOfrecido.
	 *
	 * @param dto          datos de entrada
	 * @param profesional  profesional asociado
	 * @param subcategoria subcategoría del servicio
	 * @return entidad lista para persistir
	 */
	public static ServicioOfrecido toEntity(ServicioCreateDTO dto, ProfesionalInfo profesional,
			SubcategoriaServicio subcategoria) {

		ServicioOfrecido s = new ServicioOfrecido();

		s.setTitulo(dto.getTitulo());
		s.setDescripcion(dto.getDescripcion());
		s.setDuracionMin(dto.getDuracionMin());
		s.setPrecioHora(dto.getPrecioHora());
		s.setProfesional(profesional);
		s.setSubcategoria(subcategoria);

		return s;
	}
}
