package com.jobfree.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
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

		// Comprobamos si ya hay una autenticación real (no anónima)
		Authentication existente = SecurityContextHolder.getContext().getAuthentication();
		boolean yaAutenticado = existente != null
				&& existente.isAuthenticated()
				&& !(existente instanceof AnonymousAuthenticationToken);

		// Si hay email en el token y el contexto no tiene aún un usuario real, autenticamos
		if (email != null && !yaAutenticado) {

			// Buscamos el usuario en la base de datos
			Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

			// Si existe, lo metemos en el contexto de seguridad
			if (usuario != null) {

				// Creamos el rol con el prefijo ROLE_ que espera Spring Security
				SimpleGrantedAuthority authority =
						new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());

				// Creamos el objeto de autenticación
				UsernamePasswordAuthenticationToken autenticacion =
						new UsernamePasswordAuthenticationToken(usuario, null, List.of(authority));

				// IMPORTANTE — Spring Security 6: hay que crear un contexto nuevo y asignarlo
				// con setContext(). El patrón antiguo getContext().setAuthentication() modificaba
				// un proxy diferido (DeferredSecurityContext) que no se propagaba correctamente
				// a los filtros de autorización en Spring Security 6.x.
				SecurityContext nuevoContexto = SecurityContextHolder.createEmptyContext();
				nuevoContexto.setAuthentication(autenticacion);
				SecurityContextHolder.setContext(nuevoContexto);
			}
		}

		// Seguimos con el resto de filtros
		filtroCadena.doFilter(request, response);
	}
}
