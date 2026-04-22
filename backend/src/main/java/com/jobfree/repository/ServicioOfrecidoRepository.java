package com.jobfree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jobfree.model.entity.ServicioOfrecido;

public interface ServicioOfrecidoRepository extends JpaRepository<ServicioOfrecido, Long> {

	// Servicios por subcategoría (paginado)
    Page<ServicioOfrecido> findBySubcategoriaId(Long subcategoriaId, Pageable pageable);

    // Servicios activos por subcategoría (paginado)
    Page<ServicioOfrecido> findBySubcategoriaIdAndActivaTrue(Long subcategoriaId, Pageable pageable);

    // Servicios por categoría
    List<ServicioOfrecido> findBySubcategoriaCategoriaId(Long categoriaId);

    // Servicios activos por categoría
    List<ServicioOfrecido> findBySubcategoriaCategoriaIdAndActivaTrue(Long categoriaId);

    // Todos los servicios activos
    List<ServicioOfrecido> findByActivaTrue();

    // Servicios de un profesional concreto
    List<ServicioOfrecido> findByProfesionalId(Long profesionalId);
}
