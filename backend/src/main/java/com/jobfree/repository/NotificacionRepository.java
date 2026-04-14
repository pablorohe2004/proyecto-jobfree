package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

	List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
