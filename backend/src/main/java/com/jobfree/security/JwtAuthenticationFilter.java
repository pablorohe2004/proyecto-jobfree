package com.jobfree.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro que revisa cada petición para ver si viene con un token JWT.
 * Si el token es válido, se identifica al usuario automáticamente.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UsuarioRepository usuarioRepository;

	public JwtAuthenticationFilter(JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
		this.jwtUtil = jwtUtil;
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filtroCadena)
			throws ServletException, IOException {

		// Miramos si la petición trae la cabecera Authorization
		final String cabeceraAuth = request.getHeader("Authorization");

		// Si no hay token o no empieza por "Bearer ", seguimos sin hacer nada
		if (cabeceraAuth == null || !cabeceraAuth.startsWith("Bearer ")) {
			filtroCadena.doFilter(request, response);
			return;
		}

		// Quitamos el "Bearer " para quedarnos solo con el token
		String token = cabeceraAuth.substring(7);

		// Comprobamos que el token sea válido (no caducado ni manipulado)
		if (!jwtUtil.esTokenValido(token)) {
			filtroCadena.doFilter(request, response);
			return;
		}

		// Sacamos el email que viene dentro del token
		String email = jwtUtil.extraerEmail(token);

		// Si hay email y todavía no hay usuario autenticado
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			// Buscamos el usuario en la base de datos
			Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

			// Si existe, lo metemos en el contexto de seguridad
			if (usuario != null) {

				// Creamos el rol
				SimpleGrantedAuthority authority =
						new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());

				// Creamos el objeto de autenticación
				UsernamePasswordAuthenticationToken autenticacion =
						new UsernamePasswordAuthenticationToken(usuario, null, List.of(authority));

				// Guardamos la autenticación para que Spring lo reconozca como usuario logueado
				SecurityContextHolder.getContext().setAuthentication(autenticacion);
			}
		}

		// Seguimos con el resto de filtros
		filtroCadena.doFilter(request, response);
	}
}
