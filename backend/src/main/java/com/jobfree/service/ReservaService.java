package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Reserva;
import com.jobfree.repository.ReservaRepository;

@Service
public class ReservaService {

	private final ReservaRepository reservaRepository;

	public ReservaService(ReservaRepository reservaRepository) {
		this.reservaRepository = reservaRepository;
	}

	/**
	 * Devuelve todas las reservas registradas.
	 *
	 * @return Lista de reservas.
	 */
	public List<Reserva> listarReservas() {
		return reservaRepository.findAll();
	}

	/**
	 * Guarda una nueva reserva.
	 *
	 * @param reserva Reserva que se quiere guardar.
	 * @return Reserva guardada.
	 */
	public Reserva guardarReserva(Reserva reserva) {
		return reservaRepository.save(reserva);
	}
}
