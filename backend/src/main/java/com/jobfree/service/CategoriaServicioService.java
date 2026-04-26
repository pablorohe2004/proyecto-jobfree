package com.jobfree.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jobfree.dto.categoria.CategoriaCreateDTO;
import com.jobfree.exception.categoria.CategoriaDuplicadaException;
import com.jobfree.exception.categoria.CategoriaNotFoundException;
import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.repository.CategoriaServicioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoriaServicioService {

	private final CategoriaServicioRepository categoriaRepository;

	public CategoriaServicioService(CategoriaServicioRepository categoriaRepository) {
		this.categoriaRepository = categoriaRepository;
	}

	/**
	 * Obtiene todas las categorías almacenadas en la base de datos.
	 *
	 * @return lista de categorías
	 */
	@Cacheable("categorias")
	public List<CategoriaServicio> listarCategorias() {
		return categoriaRepository.findAll();
	}

	/**
	 * Busca una categoría por su ID.
	 *
	 * @param id identificador de la categoría
	 * @return categoría encontrada en la base de datos
	 * @throws CategoriaNotFoundException si no existe la categoría
	 */
	public CategoriaServicio obtenerPorId(Long id) {
		return categoriaRepository.findById(id).orElseThrow(() -> new CategoriaNotFoundException(id));
	}

	/**
	 * Crea una nueva categoría a partir de un DTO.
	 *
	 * @param dto datos de la categoría a crear
	 * @return categoría creada y persistida
	 * @throws CategoriaDuplicadaException si ya existe una categoría con el mismo
	 *                                     nombre
	 */
	@CacheEvict(value = "categorias", allEntries = true)
	public CategoriaServicio crear(CategoriaCreateDTO dto) {

		String nombreNormalizado = dto.getNombre().trim().toLowerCase();

		if (categoriaRepository.existsByNombre(nombreNormalizado)) {
			throw new CategoriaDuplicadaException(nombreNormalizado);
		}

		CategoriaServicio categoria = new CategoriaServicio();
		categoria.setNombre(nombreNormalizado);

		return categoriaRepository.save(categoria);
	}

	/**
	 * Actualiza una categoría existente a partir de un DTO.
	 *
	 * @param id  identificador de la categoría
	 * @param dto nuevos datos de la categoría
	 * @return categoría actualizada
	 * @throws CategoriaNotFoundException  si la categoría no existe
	 * @throws CategoriaDuplicadaException si el nombre ya está en uso
	 */
	@CacheEvict(value = "categorias", allEntries = true)
	public CategoriaServicio actualizar(Long id, CategoriaCreateDTO dto) {

		CategoriaServicio existente = obtenerPorId(id);

		String nombreNormalizado = dto.getNombre().trim().toLowerCase();

		if (!existente.getNombre().equals(nombreNormalizado) && categoriaRepository.existsByNombre(nombreNormalizado)) {

			throw new CategoriaDuplicadaException(nombreNormalizado);
		}

		existente.setNombre(nombreNormalizado);

		return categoriaRepository.save(existente);
	}

	/**
	 * Elimina una categoría por su ID.
	 *
	 * @param id identificador de la categoría
	 * @throws CategoriaNotFoundException si la categoría no existe
	 */
	@CacheEvict(value = "categorias", allEntries = true)
	public void eliminarCategoria(Long id) {
		CategoriaServicio categoria = obtenerPorId(id);
		categoriaRepository.delete(categoria);
	}
}