package com.jobfree.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {

	// Busca el pago asociado a una reserva concreta.
	Optional<Pago> findByReservaId(Long reservaId);
}
