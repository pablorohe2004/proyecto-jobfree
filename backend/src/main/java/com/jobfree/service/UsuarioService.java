package com.jobfree.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;

@Service
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;

	public UsuarioService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	/**
	 * Devuelve todos los usuarios registrados en la base de datos.
	 *
	 * @return Lista de usuarios.
	 */
	public List<Usuario> listarUsuarios() {
		return usuarioRepository.findAll();
	}

	/**
	 * Guarda un nuevo usuario.
	 *
	 * @param usuario Usuario que se quiere guardar.
	 * @return Usuario guardado.
	 */
	public Usuario guardarUsuario(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}
}
