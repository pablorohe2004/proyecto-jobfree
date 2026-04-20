package com.jobfree.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
			// Aplicamos la configuración CORS antes de cualquier otra cosa.
			// Esto es necesario porque Spring Security intercepta las peticiones
			// preflight (OPTIONS) antes de que lleguen a los controladores,
			// así que el @CrossOrigin en los controladores no funciona solo.
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))

			// Desactivamos CSRF porque usamos JWT (no hay cookies de sesión)
			.csrf(csrf -> csrf.disable())

			// Sin sesiones, cada petición se autentica con su propio token
			.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			)

			// Permisos por ruta
			.authorizeHttpRequests(auth -> auth

				// públicos
				.requestMatchers("/auth/**").permitAll()
				.requestMatchers("/usuarios/cliente").permitAll()
				.requestMatchers("/usuarios/profesional").permitAll()

				.requestMatchers("/categorias/**").permitAll()
				.requestMatchers("/subcategorias/**").permitAll()

				// Solo las lecturas (GET) de servicios son públicas.
				.requestMatchers(HttpMethod.GET, "/servicios/**").permitAll()

				// Las escrituras de servicios requieren rol PROFESIONAL directamente aquí,
				// sin depender de @PreAuthorize, para evitar problemas de contexto en Spring Security 6.
				.requestMatchers(HttpMethod.POST, "/servicios").hasRole("PROFESIONAL")
				.requestMatchers(HttpMethod.PATCH, "/servicios/**").hasRole("PROFESIONAL")
				.requestMatchers(HttpMethod.DELETE, "/servicios/**").hasRole("PROFESIONAL")

				// el resto requiere autenticación
				.anyRequest().authenticated()
			)

			// añadimos nuestro filtro JWT antes del filtro de autenticación de Spring
			.addFilterBefore(filtroJwt, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	/**
	 * Configuración CORS global.
	 * Permite peticiones desde el frontend (localhost:3000) con cualquier
	 * cabecera y los métodos HTTP que necesitamos.
	 * Al definirlo aquí, Spring Security lo aplica antes de sus propios filtros,
	 * lo que hace que las peticiones preflight (OPTIONS) pasen correctamente.
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		// Usamos addAllowedOriginPattern para mayor compatibilidad
		config.addAllowedOriginPattern("*");

		// Métodos HTTP que puede usar el frontend
		config.addAllowedMethod("*");

		// Cabeceras permitidas — incluye Authorization (donde va el token JWT)
		config.addAllowedHeader("*");

		// Aplicamos esta configuración a todas las rutas del backend
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return source;
	}

	/**
	 * Bean para encriptar contraseñas usando BCrypt.
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
