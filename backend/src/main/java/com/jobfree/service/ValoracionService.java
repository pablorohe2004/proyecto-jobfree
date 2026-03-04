package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Valoracion;
import com.jobfree.repository.ValoracionRepository;

@Service
public class ValoracionService {

	private final ValoracionRepository valoracionRepository;

	public ValoracionService(ValoracionRepository valoracionRepository) {
		this.valoracionRepository = valoracionRepository;
	}

	/**
	 * Obtiene la lista completa de valoraciones registradas.
	 *
	 * @return Lista de valoraciones almacenadas en la base de datos.
	 */
	public List<Valoracion> listarValoraciones() {
		return valoracionRepository.findAll();
	}

	/**
	 * Guarda una nueva valoración en la base de datos.
	 *
	 * @param valoracion Valoración que se quiere guardar.
	 * @return Valoración guardada.
	 */
	public Valoracion guardarValoracion(Valoracion valoracion) {
		return valoracionRepository.save(valoracion);
	}

}
