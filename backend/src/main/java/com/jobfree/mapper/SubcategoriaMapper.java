package com.jobfree.mapper;

import com.jobfree.dto.subcategoria.SubcategoriaCreateDTO;
import com.jobfree.dto.subcategoria.SubcategoriaDTO;
import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.model.entity.SubcategoriaServicio;

/**
 * Mapper para convertir entre la entidad SubcategoriaServicio y sus DTOs.
 */
public class SubcategoriaMapper {

	/**
	 * Convierte una entidad SubcategoriaServicio a su DTO de salida.
	 *
	 * @param s entidad subcategoría
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static SubcategoriaDTO toDTO(SubcategoriaServicio s) {
		return new SubcategoriaDTO(s.getId(), s.getNombre(), s.getDescripcion(), s.getImagen(),
				s.getCategoria().getId(), s.getCategoria().getNombre());
	}

	/**
	 * Convierte un DTO de creación a entidad SubcategoriaServicio.
	 *
	 * @param dto       datos de entrada
	 * @param categoria categoría asociada
	 * @return entidad lista para persistir
	 */
	public static SubcategoriaServicio toEntity(SubcategoriaCreateDTO dto, CategoriaServicio categoria) {

		SubcategoriaServicio s = new SubcategoriaServicio();

		s.setNombre(dto.getNombre());
		s.setDescripcion(dto.getDescripcion());
		s.setImagen(dto.getImagen());
		s.setCategoria(categoria);

		return s;
	}
}
