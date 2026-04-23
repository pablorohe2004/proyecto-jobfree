package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jobfree.model.entity.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

	/** Mensajes recibidos por un usuario */
	List<Mensaje> findByDestinatarioId(Long usuarioId);

	/** Mensajes enviados por un usuario */
	List<Mensaje> findByRemitenteId(Long usuarioId);

	/** Mensajes de una conversación ordenados por fecha */
	List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(Long conversacionId);

	@Query("select m from Mensaje m where m.id in :ids and m.destinatario.id = :destinatarioId")
	List<Mensaje> findByIdInAndDestinatarioId(List<Long> ids, Long destinatarioId);

	Optional<Mensaje> findByConversacionIdAndRemitenteIdAndClientMessageId(Long conversacionId, Long remitenteId, String clientMessageId);
}
