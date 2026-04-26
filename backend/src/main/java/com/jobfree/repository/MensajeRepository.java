package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobfree.model.entity.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.destinatario.id = :usuarioId
            """)
    List<Mensaje> findByDestinatarioId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.remitente.id = :usuarioId
            """)
    List<Mensaje> findByRemitenteId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT m FROM Mensaje m
            JOIN FETCH m.remitente
            JOIN FETCH m.destinatario
            WHERE m.conversacion.id = :conversacionId
            ORDER BY m.fechaEnvio ASC
            """)
    List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(@Param("conversacionId") Long conversacionId);

    @Query("SELECT m FROM Mensaje m WHERE m.id IN :ids AND m.destinatario.id = :destinatarioId")
    List<Mensaje> findByIdInAndDestinatarioId(@Param("ids") List<Long> ids,
                                              @Param("destinatarioId") Long destinatarioId);

    Optional<Mensaje> findByConversacionIdAndRemitenteIdAndClientMessageId(Long conversacionId, Long remitenteId, String clientMessageId);

    long countByDestinatarioIdAndLeidoFalse(Long destinatarioId);
}
