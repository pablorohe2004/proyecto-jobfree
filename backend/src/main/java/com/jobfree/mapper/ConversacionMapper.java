package com.jobfree.mapper;

import java.util.Comparator;

import com.jobfree.dto.conversacion.ConversacionDTO;
import com.jobfree.model.entity.Conversacion;
import com.jobfree.model.entity.Mensaje;
import com.jobfree.model.entity.Usuario;

public class ConversacionMapper {

	public static ConversacionDTO toDTO(Conversacion conversacion) {
		ConversacionDTO dto = new ConversacionDTO();

		dto.setId(conversacion.getId());
		dto.setReservaId(conversacion.getReserva() != null ? conversacion.getReserva().getId() : null);
		dto.setFechaCreacion(conversacion.getFechaCreacion());

		Usuario cliente = conversacion.getCliente();
		dto.setClienteId(cliente.getId());
		dto.setClienteNombre(cliente.getNombreCompleto());
		dto.setClienteFotoUrl(cliente.getFotoUrl());

		Usuario profesional = conversacion.getProfesional();
		dto.setProfesionalId(profesional.getId());
		dto.setProfesionalNombre(profesional.getNombreCompleto());
		dto.setProfesionalFotoUrl(profesional.getFotoUrl());

		dto.setServicioTitulo(
				conversacion.getReserva() != null
						? conversacion.getReserva().getServicio().getTitulo()
						: "Contacto inicial"
		);

		Mensaje ultimoMensaje = conversacion.getMensajes().stream()
				.max(Comparator.comparing(Mensaje::getFechaEnvio))
				.orElse(null);

		if (ultimoMensaje != null) {
			dto.setUltimoMensaje(ultimoMensaje.getContenido());
			dto.setFechaUltimoMensaje(ultimoMensaje.getFechaEnvio());
		}

		return dto;
	}
}
