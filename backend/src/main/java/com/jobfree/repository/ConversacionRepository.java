package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Conversacion;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

	Optional<Conversacion> findByReservaId(Long reservaId);

	Optional<Conversacion> findByContactoClave(String contactoClave);

	Optional<Conversacion> findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(Long clienteId, Long profesionalId);

	List<Conversacion> findByClienteIdOrProfesionalIdOrderByFechaCreacionDesc(Long clienteId, Long profesionalId);
}
