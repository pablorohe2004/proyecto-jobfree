package com.jobfree.mapper;

import com.jobfree.dto.categoria.CategoriaCreateDTO;
import com.jobfree.dto.categoria.CategoriaDTO;
import com.jobfree.model.entity.CategoriaServicio;

/**
 * Mapper para convertir entre la entidad CategoriaServicio y sus DTOs.
 */
public final class CategoriaMapper {

	/**
	 * Convierte una entidad CategoriaServicio a su DTO de salida.
	 *
	 * @param c entidad categoría
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static CategoriaDTO toDTO(CategoriaServicio c) {
		return new CategoriaDTO(c.getId(), c.getNombre());
	}

	/**
	 * Convierte un DTO de creación a entidad CategoriaServicio.
	 *
	 * @param dto datos de entrada
	 * @return entidad lista para persistir
	 */
	public static CategoriaServicio toEntity(CategoriaCreateDTO dto) {
		CategoriaServicio c = new CategoriaServicio();
		c.setNombre(dto.getNombre());
		return c;
	}
}
