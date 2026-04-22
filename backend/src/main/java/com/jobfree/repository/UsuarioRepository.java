package com.jobfree.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobfree.model.entity.Usuario;

/**
 * Repositorio para acceder a la base de datos de usuarios.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	// Comprueba si ya existe un email
	boolean existsByEmail(String email);

	// Comprueba si ya existe un teléfono
	boolean existsByTelefono(String telefono);

	// Busca un usuario por email (login)
	Optional<Usuario> findByEmail(String email);
}