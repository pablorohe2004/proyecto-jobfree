package com.jobfree.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobfree.model.entity.ServicioOfrecido;

public interface ServicioOfrecidoRepository extends JpaRepository<ServicioOfrecido, Long> {

	List<ServicioOfrecido> findByCategoriaId(Long categoriaId);
}
