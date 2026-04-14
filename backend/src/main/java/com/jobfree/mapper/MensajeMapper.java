package com.jobfree.mapper;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad Mensaje y sus DTOs.
 */
public class MensajeMapper {

	/**
	 * Convierte una entidad Mensaje a su DTO de salida.
	 *
	 * @param m entidad mensaje
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static MensajeDTO toDTO(Mensaje m) {
		return new MensajeDTO(m.getId(), m.getContenido(), m.isLeido(), m.getFechaEnvio(), m.getRemitente().getId(),
				m.getDestinatario().getId(), m.getReserva().getId());
	}

	/**
	 * Convierte un DTO de creación a entidad Mensaje.
	 *
	 * @param dto          datos de entrada
	 * @param remitente    usuario que envía el mensaje
	 * @param destinatario usuario que recibe el mensaje
	 * @param reserva      reserva asociada
	 * @return entidad lista para persistir
	 */
	public static Mensaje toEntity(MensajeCreateDTO dto, Usuario remitente, Usuario destinatario, Reserva reserva) {

		Mensaje m = new Mensaje();

		m.setContenido(dto.getContenido());
		m.setRemitente(remitente);
		m.setDestinatario(destinatario);
		m.setReserva(reserva);

		return m;
	}
}