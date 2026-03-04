package com.jobfree.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobfree.model.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
