package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Mensaje;
import com.jobfree.repository.MensajeRepository;

@Service
public class MensajeService {

	private final MensajeRepository mensajeRepository;

	public MensajeService(MensajeRepository mensajeRepository) {
		this.mensajeRepository = mensajeRepository;
	}

	/**
	 * Devuelve todos los mensajes guardados en la base de datos. Se usa para
	 * consultar el historial completo de mensajes.
	 * 
	 * @return Lista de mensajes.
	 */
	public List<Mensaje> listarMensajes() {
		return mensajeRepository.findAll();
	}

	/**
	 * Guarda un nuevo mensaje enviado por un usuario.
	 *
	 * @param mensaje Mensaje que se quiere guardar.
	 * @return Mensaje guardado.
	 */
	public Mensaje guardarMensaje(Mensaje mensaje) {
		return mensajeRepository.save(mensaje);
	}
}
