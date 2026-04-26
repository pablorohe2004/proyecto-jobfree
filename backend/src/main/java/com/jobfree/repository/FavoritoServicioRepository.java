package com.jobfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.FavoritoServicio;

public interface FavoritoServicioRepository extends JpaRepository<FavoritoServicio, Long> {

	List<FavoritoServicio> findByClienteIdOrderByFechaCreacionDesc(Long clienteId);

	Optional<FavoritoServicio> findByClienteIdAndServicioId(Long clienteId, Long servicioId);

	boolean existsByClienteIdAndServicioId(Long clienteId, Long servicioId);
}
