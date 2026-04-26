package com.jobfree.mapper;

import com.jobfree.dto.favorito.FavoritoServicioDTO;
import com.jobfree.model.entity.FavoritoServicio;

public class FavoritoServicioMapper {

	public static FavoritoServicioDTO toDTO(FavoritoServicio favorito) {
		return new FavoritoServicioDTO(
				favorito.getId(),
				favorito.getFechaCreacion(),
				ServicioMapper.toDTO(favorito.getServicio())
		);
	}
}
