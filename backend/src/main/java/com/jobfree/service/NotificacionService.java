package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Notificacion;
import com.jobfree.repository.NotificacionRepository;

@Service
public class NotificacionService {

	private final NotificacionRepository notificacionRepository;

	public NotificacionService(NotificacionRepository notificacionRepository) {
		this.notificacionRepository = notificacionRepository;
	}

	/**
	 * Obtiene la lista completa de notificaciones que hay en la base de datos.
	 *
	 * @return Lista de notificaciones.
	 */
	public List<Notificacion> listarNotificaciones() {
		return notificacionRepository.findAll();
	}

	/**
	 * Guarda una nueva notificacion en la base de datos.
	 *
	 * @param notificacion Notificacion que se quiere registrar.
	 * @return Notificacion guardada correctamente.
	 */
	public Notificacion guardarNotificacion(Notificacion notificacion) {
		return notificacionRepository.save(notificacion);
	}
}
