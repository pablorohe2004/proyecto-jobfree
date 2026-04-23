package com.jobfree.mapper;

import com.jobfree.dto.reserva.ReservaCreateDTO;
import com.jobfree.dto.reserva.ReservaDTO;
import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;

/**
 * Mapper para convertir entre la entidad Reserva y sus DTOs.
 */
public class ReservaMapper {

	/**
	 * Convierte una entidad Reserva a su DTO de salida.
	 *
	 * @param r entidad reserva
	 * @return DTO con los datos necesarios para la respuesta
	 */
	public static ReservaDTO toDTO(Reserva r) {
		ReservaDTO dto = new ReservaDTO(
				r.getId(), r.getFechaInicio(), r.getPrecioTotal(), r.getEstado(),
				r.getCliente().getId(), r.getServicio().getId());
		dto.setClienteNombre(r.getCliente().getNombre() + " " + r.getCliente().getApellidos());
		dto.setServicioTitulo(r.getServicio().getTitulo());
		dto.setProfesionalId(r.getServicio().getProfesional().getUsuario().getId());
		dto.setProfesionalNombre(r.getServicio().getProfesional().getUsuario().getNombre() + " "
				+ r.getServicio().getProfesional().getUsuario().getApellidos());
		return dto;
	}

	/**
	 * Convierte un DTO de creación a entidad Reserva.
	 *
	 * @param dto      datos de entrada
	 * @param cliente  usuario cliente
	 * @param servicio servicio asociado
	 * @return entidad lista para persistir
	 */
	public static Reserva toEntity(ReservaCreateDTO dto, Usuario cliente, ServicioOfrecido servicio) {

		Reserva r = new Reserva();

		r.setCliente(cliente);
		r.setServicio(servicio);
		r.setFechaInicio(dto.getFechaInicio());

		return r;
	}
}