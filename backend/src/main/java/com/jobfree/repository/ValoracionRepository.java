package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Valoracion;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    // Comprueba si una reserva ya tiene valoración
    boolean existsByReservaId(Long reservaId);

    List<Valoracion> findByClienteIdOrderByFechaDesc(Long clienteId);

    List<Valoracion> findByProfesionalIdOrderByFechaDesc(Long profesionalId);

    // Media de valoraciones de un profesional
    @Query("SELECT AVG(v.estrellas) FROM Valoracion v WHERE v.profesional.id = :profesionalId")
    Double obtenerMediaPorProfesional(@Param("profesionalId") Long profesionalId);

    // Total de valoraciones de un profesional
    @Query("SELECT COUNT(v) FROM Valoracion v WHERE v.profesional.id = :profesionalId")
    Long contarPorProfesional(@Param("profesionalId") Long profesionalId);
}
