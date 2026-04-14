package com.jobfree.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Clase util para trabajar con JWT:
 * - Generar token
 * - Validar token
 * - Extraer datos (email)
 */
@Component
public class JwtUtil {

	// Clave secreta definida en application.properties
	@Value("${jwt.secret}")
	private String secreto;

	/**
	 * Genera la clave de firma a partir del secreto.
	 */
	private Key obtenerClave() {
		return Keys.hmacShaKeyFor(secreto.getBytes());
	}

	/**
	 * Genera un token JWT con el email del usuario.
	 *
	 * @param email email del usuario autenticado
	 * @return token válido durante 24 horas
	 */
	public String generarToken(String email) {
		return Jwts.builder()
				.setSubject(email) // guardamos el email en el token
				.setIssuedAt(new Date()) // fecha de creación
				.setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
				.signWith(obtenerClave()) // firmamos el token
				.compact();
	}

	/**
	 * Comprueba si el token es válido.
	 * Si está caducado o manipulado, devuelve false.
	 *
	 * @param token token JWT
	 * @return true si es válido, false si no
	 */
	public boolean esTokenValido(String token) {
		try {
			Jwts.parserBuilder()
					.setSigningKey(obtenerClave())
					.build()
					.parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * Extrae el email desde un token JWT.
	 *
	 * @param token token JWT recibido
	 * @return email si el token es válido, null si no lo es
	 */
	public String extraerEmail(String token) {
		try {
			return Jwts.parserBuilder()
					.setSigningKey(obtenerClave())
					.build()
					.parseClaimsJws(token)
					.getBody()
					.getSubject();
		} catch (Exception e) {
			// Si falla (caducado, mal firmado...), devolvemos null
			return null;
		}
	}
}
