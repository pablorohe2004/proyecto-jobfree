package com.jobfree.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.ProfesionalInfo;

public interface ProfesionalInfoRepository extends JpaRepository<ProfesionalInfo, Long> {

	// Busca el perfil profesional de un usuario
	Optional<ProfesionalInfo> findByUsuarioId(Long usuarioId);

	// Comprueba si ya existe un CIF en la base de datos
	boolean existsByCif(String cif);
}
