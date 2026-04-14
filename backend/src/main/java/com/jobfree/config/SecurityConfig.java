package com.jobfree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jobfree.security.JwtAuthenticationFilter;

/**
 * Configuración de seguridad de la aplicación. Define qué endpoints son
 * públicos y cuáles requieren autenticación.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter filtroJwt;

	public SecurityConfig(JwtAuthenticationFilter filtroJwt) {
		this.filtroJwt = filtroJwt;
	}

	@Bean
public SecurityFilterChain configurarSeguridad(HttpSecurity http) throws Exception {

    http
        // Desactivamos CSRF porque usamos JWT
        .csrf(csrf -> csrf.disable())

        // Sin sesiones
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

        // Permisos
        .authorizeHttpRequests(auth -> auth

            // públicos
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/usuarios/cliente").permitAll()
            .requestMatchers("/usuarios/profesional").permitAll()

            .requestMatchers("/categorias/**").permitAll()
            .requestMatchers("/subcategorias/**").permitAll()
            .requestMatchers("/servicios/**").permitAll()

            // resto protegido
            .anyRequest().authenticated()
        )

        // filtro JWT
        .addFilterBefore(filtroJwt, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

	/**
	 * Bean para encriptar contraseñas usando BCrypt.
	 *
	 * @return codificador de contraseñas
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
