package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.exception.servicio.ServicioInvalidoException;
import com.jobfree.model.entity.FavoritoServicio;
import com.jobfree.model.entity.ServicioOfrecido;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.FavoritoServicioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FavoritoServicioService {

	private final FavoritoServicioRepository favoritoRepository;
	private final ServicioOfrecidoService servicioService;

	public FavoritoServicioService(FavoritoServicioRepository favoritoRepository,
			ServicioOfrecidoService servicioService) {
		this.favoritoRepository = favoritoRepository;
		this.servicioService = servicioService;
	}

	public List<FavoritoServicio> listarPorCliente(Usuario cliente) {
		return favoritoRepository.findByClienteIdOrderByFechaCreacionDesc(cliente.getId());
	}

	public FavoritoServicio crearFavorito(Long servicioId, Usuario cliente) {
		ServicioOfrecido servicio = servicioService.obtenerPorId(servicioId);

		if (!servicio.isActiva()) {
			throw new ServicioInvalidoException("Solo se pueden guardar como favorito servicios activos");
		}

		if (favoritoRepository.existsByClienteIdAndServicioId(cliente.getId(), servicioId)) {
			throw new ServicioInvalidoException("Este servicio ya está en favoritos");
		}

		FavoritoServicio favorito = new FavoritoServicio(cliente, servicio);
		return favoritoRepository.save(favorito);
	}

	public void eliminarFavorito(Long servicioId, Usuario cliente) {
		FavoritoServicio favorito = favoritoRepository.findByClienteIdAndServicioId(cliente.getId(), servicioId)
				.orElseThrow(() -> new ServicioInvalidoException("Ese servicio no está en favoritos"));

		favoritoRepository.delete(favorito);
	}

	public boolean esFavorito(Long servicioId, Usuario cliente) {
		return favoritoRepository.existsByClienteIdAndServicioId(cliente.getId(), servicioId);
	}
}
