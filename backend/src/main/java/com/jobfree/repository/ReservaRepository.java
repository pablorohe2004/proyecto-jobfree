package com.jobfree.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Reserva;
import com.jobfree.model.entity.ServicioOfrecido;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

	boolean existsByServicioAndFechaInicio(ServicioOfrecido servicio, LocalDateTime fechaInicio);

	List<Reserva> findByClienteIdOrderByFechaCreacionDesc(Long clienteId);

	List<Reserva> findByServicioProfesionalUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
