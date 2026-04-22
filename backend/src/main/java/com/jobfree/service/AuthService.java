package com.jobfree.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobfree.exception.auth.CredencialesInvalidasException;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;

@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Usuario login(String email, String password) {
		Usuario usuario = usuarioRepository.findByEmail(email)
				.orElseThrow(CredencialesInvalidasException::new);

		if (!passwordEncoder.matches(password, usuario.getPassword())) {
			throw new CredencialesInvalidasException();
		}

		return usuario;
	}
	
}
