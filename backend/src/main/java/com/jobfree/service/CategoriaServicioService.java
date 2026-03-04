package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.repository.CategoriaServicioRepository;

@Service
public class CategoriaServicioService {

	private final CategoriaServicioRepository categoriaRepository;

	public CategoriaServicioService(CategoriaServicioRepository categoriaRepository) {
		this.categoriaRepository = categoriaRepository;
	}

	/**
	 * Devuelve todas las categorías guardadas en la base de datos.
	 *
	 * @return Lista de categorías.
	 */
	public List<CategoriaServicio> listarCategorias() {
		return categoriaRepository.findAll();
	}

	/**
	 * Guarda una nueva categoría.
	 *
	 * @param categoria Categoría que se quiere guardar.
	 * @return Categoría guardada.
	 */
	public CategoriaServicio guardarCategoria(CategoriaServicio categoria) {
		return categoriaRepository.save(categoria);
	}

}
