package com.jobfree.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jobfree.repository.UsuarioRepository;

/**
 * Migración puntual de contraseñas legacy en texto plano a BCrypt.
 * Deshabilitada por defecto. Activar con app.migration.passwords=true
 * solo durante el proceso de migración, luego desactivar.
 */
@Configuration
@ConditionalOnProperty(name = "app.migration.passwords", havingValue = "true")
public class PasswordMigrationConfig {

	@Bean
	public CommandLineRunner migrarPasswordsLegacy(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		return args -> usuarioRepository.findAll().forEach(usuario -> {
			String password = usuario.getPassword();
			if (password == null || password.isBlank() || esBCrypt(password)) {
				return;
			}
			usuario.setPassword(passwordEncoder.encode(password));
			usuarioRepository.save(usuario);
		});
	}

	private boolean esBCrypt(String password) {
		return password.startsWith("$2a$")
				|| password.startsWith("$2b$")
				|| password.startsWith("$2y$");
	}
}
