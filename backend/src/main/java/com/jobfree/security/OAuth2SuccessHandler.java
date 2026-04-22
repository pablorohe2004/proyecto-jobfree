package com.jobfree.security;

import java.io.IOException;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.service.UsuarioService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId();

        String email     = extraerEmail(oAuth2User, provider);
        String nombre    = extraerNombre(oAuth2User, provider);
        String apellidos = extraerApellidos(oAuth2User, provider);

        if (email == null || email.isBlank()) {
            redirigir(response, frontendUrl + "/login?error=email_missing");
            return;
        }

        // Leer rol deseado desde la cookie oauth2_rol (guardada por /auth/iniciar-oauth).
        // Se usa cookie en lugar de sesión porque la política de sesión es STATELESS.
        Rol rolDeseado = Rol.CLIENTE;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("oauth2_rol".equals(cookie.getName())) {
                    try { rolDeseado = Rol.valueOf(cookie.getValue()); }
                    catch (IllegalArgumentException ignored) {}
                    // Borrar la cookie tras consumirla
                    response.addHeader(HttpHeaders.SET_COOKIE,
                        ResponseCookie.from("oauth2_rol", "")
                            .httpOnly(true)
                            .path("/")
                            .maxAge(Duration.ofSeconds(0))
                            .sameSite("Lax")
                            .build().toString());
                    break;
                }
            }
        }

        try {
            boolean esNuevo = !usuarioService.existePorEmail(email);
            Usuario usuario = usuarioService.buscarOCrearPorOAuth2(email, nombre, apellidos, rolDeseado);
            String token = jwtUtil.generarToken(usuario.getEmail());
            // Token va en cookie httpOnly, no en la URL
            response.addHeader(HttpHeaders.SET_COOKIE, jwtUtil.crearCookieJwt(token).toString());
            String destino = frontendUrl + "/oauth2/callback" + (esNuevo ? "?nuevo=true" : "");
            redirigir(response, destino);
        } catch (Exception e) {
            redirigir(response, frontendUrl + "/login?error=oauth_error");
        }
    }

    private void redirigir(HttpServletResponse response, String url) throws IOException {
        response.sendRedirect(url);
    }

    private String extraerEmail(OAuth2User user, String provider) {
        if ("microsoft".equals(provider)) {
            String mail = user.getAttribute("mail");
            return mail != null ? mail : user.getAttribute("userPrincipalName");
        }
        return user.getAttribute("email");
    }

    private String extraerNombre(OAuth2User user, String provider) {
        if ("google".equals(provider)) {
            String given = user.getAttribute("given_name");
            return given != null ? given : splitNombre(user.getAttribute("name"), 0);
        }
        String given = user.getAttribute("givenName");
        return given != null ? given : splitNombre(user.getAttribute("name"), 0);
    }

    private String extraerApellidos(OAuth2User user, String provider) {
        if ("google".equals(provider)) {
            String family = user.getAttribute("family_name");
            return family != null ? family : "";
        }
        String surname = user.getAttribute("surname");
        if (surname != null) return surname;
        return splitNombre(user.getAttribute("name"), 1);
    }

    private String splitNombre(String fullName, int parte) {
        if (fullName == null || fullName.isBlank()) return parte == 0 ? "Usuario" : "";
        int espacio = fullName.indexOf(' ');
        if (espacio < 0) return parte == 0 ? fullName : "";
        return parte == 0 ? fullName.substring(0, espacio) : fullName.substring(espacio + 1);
    }
}
