package com.jobfree.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jobfree.model.entity.SubcategoriaServicio;

public interface SubcategoriaServicioRepository extends JpaRepository<SubcategoriaServicio, Long> {

    Page<SubcategoriaServicio> findByCategoria_Id(Long categoriaId, Pageable pageable);
	
    boolean existsByNombreAndCategoria_Id(String nombre, Long categoriaId);
}
