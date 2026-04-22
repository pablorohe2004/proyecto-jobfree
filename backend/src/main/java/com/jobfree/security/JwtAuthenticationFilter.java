package com.jobfree.security;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	private final JwtUtil jwtUtil;
	private final UsuarioRepository usuarioRepository;

	public JwtAuthenticationFilter(JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
		this.jwtUtil = jwtUtil;
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getServletPath();
		return path.startsWith("/oauth2/") || path.startsWith("/login/oauth2/");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filtroCadena)
			throws ServletException, IOException {

		String token = extraerToken(request);

		if (token == null || !jwtUtil.esTokenValido(token)) {
			filtroCadena.doFilter(request, response);
			return;
		}

		String email = jwtUtil.extraerEmail(token);

		Authentication existente = SecurityContextHolder.getContext().getAuthentication();
		boolean yaAutenticado = existente != null
				&& existente.isAuthenticated()
				&& !(existente instanceof AnonymousAuthenticationToken);

		if (email != null && !yaAutenticado) {
			Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

			if (usuario == null) {
				// Token válido pero el usuario ya no existe (p.ej. cuenta eliminada).
				// Solo logueamos y continuamos sin autenticar — Spring Security
				// rechazará la petición si el endpoint requiere autenticación,
				// pero los endpoints públicos (registro, etc.) seguirán funcionando.
				log.warn("Token válido pero el usuario '{}' no existe en BD. Continuando sin autenticar.", email);
				filtroCadena.doFilter(request, response);
				return;
			}

			SimpleGrantedAuthority authority =
					new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());

			UsernamePasswordAuthenticationToken autenticacion =
					new UsernamePasswordAuthenticationToken(usuario, null, List.of(authority));

			SecurityContext nuevoContexto = SecurityContextHolder.createEmptyContext();
			nuevoContexto.setAuthentication(autenticacion);
			SecurityContextHolder.setContext(nuevoContexto);
		}

		filtroCadena.doFilter(request, response);
	}

	private String extraerToken(HttpServletRequest request) {
		// Cookie httpOnly (flujo web)
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if ("jf_token".equals(cookie.getName())) {
					String valor = cookie.getValue();
					return (valor != null && !valor.isBlank()) ? valor : null;
				}
			}
		}
		// Fallback: header Authorization (clientes de API externos)
		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		return null;
	}
}
