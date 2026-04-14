package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

	/** Mensajes recibidos por un usuario */
	List<Mensaje> findByDestinatarioId(Long usuarioId);

	/** Mensajes enviados por un usuario */
	List<Mensaje> findByRemitenteId(Long usuarioId);

	/** Mensajes de una reserva ordenados por fecha */
	List<Mensaje> findByReservaIdOrderByFechaEnvioAsc(Long reservaId);
}
