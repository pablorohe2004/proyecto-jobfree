package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Conversacion;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    Optional<Conversacion> findByReservaId(Long reservaId);

    Optional<Conversacion> findByContactoClave(String contactoClave);

    Optional<Conversacion> findFirstByClienteIdAndProfesionalIdOrderByFechaCreacionDesc(Long clienteId, Long profesionalId);

    @Query("""
            SELECT c FROM Conversacion c
            JOIN FETCH c.cliente
            JOIN FETCH c.profesional
            WHERE c.cliente.id = :clienteId OR c.profesional.id = :profesionalId
            ORDER BY c.fechaCreacion DESC
            """)
    List<Conversacion> findByClienteIdOrProfesionalIdOrderByFechaCreacionDesc(
            @Param("clienteId") Long clienteId,
            @Param("profesionalId") Long profesionalId);

    @Query("""
            SELECT c FROM Conversacion c
            JOIN FETCH c.cliente
            JOIN FETCH c.profesional
            WHERE c.id = :id
            """)
    Optional<Conversacion> findByIdWithParticipantes(@Param("id") Long id);
}
