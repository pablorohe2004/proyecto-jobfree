package com.jobfree.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;
import com.jobfree.security.JwtUtil;

/**
 * Servicio encargado de la autenticación de usuarios. Valida credenciales y
 * genera el token JWT.
 */
@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
	}

	/**
	 * Realiza el login del usuario.
	 *
	 * @param email    email introducido
	 * @param password contraseña en texto plano
	 * @return token JWT si las credenciales son correctas
	 */
	public String login(String email, String password) {

		// Buscar usuario por email
		Usuario usuario = usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// Comprobar contraseña (comparando con la encriptada en BD)
		if (!passwordEncoder.matches(password, usuario.getPassword())) {
			throw new RuntimeException("Contraseña incorrecta");
		}

		// Generar y devolver token JWT
		return jwtUtil.generarToken(usuario.getEmail());
	}
}
