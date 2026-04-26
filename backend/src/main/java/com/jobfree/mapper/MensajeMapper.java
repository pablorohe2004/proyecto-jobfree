package com.jobfree.mapper;

import com.jobfree.dto.mensaje.MensajeCreateDTO;
import com.jobfree.dto.mensaje.MensajeDTO;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
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
		return new MensajeDTO(m.getId(), m.getContenido(), m.getClientMessageId(), m.isLeido(), m.isRecibido(), m.getFechaEnvio(), m.getRemitente().getId(),
				m.getDestinatario().getId(), m.getConversacion().getId());
	}

	/**
	 * Convierte un DTO de creación a entidad Mensaje.
	 *
	 * @param dto          datos de entrada
	 * @param remitente    usuario que envía el mensaje
	 * @param destinatario usuario que recibe el mensaje
	 * @param conversacion conversación asociada
	 * @return entidad lista para persistir
	 */
	public static Mensaje toEntity(MensajeCreateDTO dto, Usuario remitente, Usuario destinatario, Conversacion conversacion) {

		Mensaje m = new Mensaje();

		m.setContenido(dto.getContenido());
		m.setClientMessageId(dto.getClientMessageId());
		m.setRemitente(remitente);
		m.setDestinatario(destinatario);
		m.setConversacion(conversacion);

		return m;
	}
}
