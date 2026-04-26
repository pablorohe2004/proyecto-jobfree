package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.ResenaProfesional;

public interface ResenaProfesionalRepository extends JpaRepository<ResenaProfesional, Long> {

    @Query("""
            SELECT r FROM ResenaProfesional r
            JOIN FETCH r.cliente
            JOIN FETCH r.profesional p
            JOIN FETCH p.usuario
            WHERE r.cliente.id = :clienteId
            ORDER BY r.fechaCreacion DESC
            """)
    List<ResenaProfesional> findByClienteIdOrderByFechaCreacionDesc(@Param("clienteId") Long clienteId);

    @Query("""
            SELECT r FROM ResenaProfesional r
            JOIN FETCH r.cliente
            JOIN FETCH r.profesional p
            JOIN FETCH p.usuario
            WHERE r.profesional.id = :profesionalId
            ORDER BY r.fechaCreacion DESC
            """)
    List<ResenaProfesional> findByProfesionalIdOrderByFechaCreacionDesc(@Param("profesionalId") Long profesionalId);

    boolean existsByClienteIdAndProfesionalIdAndReservaId(Long clienteId, Long profesionalId, Long reservaId);

    boolean existsByClienteIdAndProfesionalId(Long clienteId, Long profesionalId);

    @Query("SELECT AVG(r.calificacion) FROM ResenaProfesional r WHERE r.profesional.id = :profesionalId")
    Double obtenerMediaPorProfesional(@Param("profesionalId") Long profesionalId);

    @Query("SELECT COUNT(r) FROM ResenaProfesional r WHERE r.profesional.id = :profesionalId")
    Long contarPorProfesional(@Param("profesionalId") Long profesionalId);
}
