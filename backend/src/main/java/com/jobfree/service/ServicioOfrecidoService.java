package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.repository.ServicioOfrecidoRepository;

@Service
public class ServicioOfrecidoService {

	private final ServicioOfrecidoRepository servicioRepository;

	public ServicioOfrecidoService(ServicioOfrecidoRepository servicioRepository) {
		this.servicioRepository = servicioRepository;
	}

	/**
	 * Devuelve todos los servicios guardados en la base de datos.
	 *
	 * @return Lista de servicios.
	 */
	public List<ServicioOfrecido> listarServicios() {
		return servicioRepository.findAll();
	}

	/**
	 * Guarda un nuevo servicio.
	 *
	 * @param servicio Servicio que se quiere guardar.
	 * @return Servicio guardado.
	 */
	public ServicioOfrecido guardarServicio(ServicioOfrecido servicio) {
		return servicioRepository.save(servicio);
	}
}
