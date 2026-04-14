package com.jobfree.mapper;

import com.jobfree.dto.notificacion.NotificacionCreateDTO;
import com.jobfree.dto.notificacion.NotificacionDTO;
import com.jobfree.model.entity.Notificacion;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad Notificacion y sus DTOs.
 */
public class NotificacionMapper {

	/**
	 * Convierte una entidad Notificacion a su DTO de salida.
	 *
	 * @param n entidad notificación
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static NotificacionDTO toDTO(Notificacion n) {
		return new NotificacionDTO(n.getId(), n.getMensaje(), n.isLeida(), n.getFechaCreacion());
	}

	/**
	 * Convierte un DTO de creación a entidad Notificacion.
	 *
	 * @param dto     datos de entrada
	 * @param usuario usuario asociado a la notificación
	 * @return entidad lista para persistir
	 */
	public static Notificacion toEntity(NotificacionCreateDTO dto, Usuario usuario) {

		Notificacion n = new Notificacion();

		n.setMensaje(dto.getMensaje());
		n.setUsuario(usuario);

		return n;
	}
}