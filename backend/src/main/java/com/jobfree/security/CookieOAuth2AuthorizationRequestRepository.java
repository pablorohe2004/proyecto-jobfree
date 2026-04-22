package com.jobfree.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Almacena el OAuth2AuthorizationRequest en una cookie usando JSON (Jackson),
 * evitando los problemas de deserialización Java nativa en JDK 17 + Spring Boot 3.x.
 * SameSite=Lax permite que la cookie se envíe en la redirección cross-site de Google → backend.
 */
@Component
public class CookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final Logger log = LoggerFactory.getLogger(CookieOAuth2AuthorizationRequestRepository.class);
    private static final String COOKIE_NAME = "oauth2_auth_request";
    private static final int MAX_AGE_SECONDS = 180;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @JsonIgnoreProperties(ignoreUnknown = true)
    record AuthRequestDto(
            String authorizationUri,
            String clientId,
            String redirectUri,
            Set<String> scopes,
            String state,
            Map<String, Object> additionalParameters,
            String authorizationRequestUri,
            Map<String, Object> attributes
    ) {
        // Constructor sin args necesario para Jackson
        AuthRequestDto() {
            this(null, null, null, null, null, null, null, null);
        }
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return getCookieValue(request)
                .flatMap(this::deserialize)
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
                                         HttpServletRequest request,
                                         HttpServletResponse response) {
        if (authorizationRequest == null) {
            deleteCookie(request, response);
            return;
        }
        try {
            AuthRequestDto dto = new AuthRequestDto(
                    authorizationRequest.getAuthorizationUri(),
                    authorizationRequest.getClientId(),
                    authorizationRequest.getRedirectUri(),
                    authorizationRequest.getScopes(),
                    authorizationRequest.getState(),
                    authorizationRequest.getAdditionalParameters(),
                    authorizationRequest.getAuthorizationRequestUri(),
                    authorizationRequest.getAttributes()
            );
            String json    = objectMapper.writeValueAsString(dto);
            String encoded = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(json.getBytes(StandardCharsets.UTF_8));

            response.addHeader(HttpHeaders.SET_COOKIE,
                    ResponseCookie.from(COOKIE_NAME, encoded)
                            .httpOnly(true)
                            .path("/")
                            .maxAge(MAX_AGE_SECONDS)
                            .sameSite("Lax")
                            .build().toString());
        } catch (Exception e) {
            log.error("Error guardando OAuth2AuthorizationRequest en cookie", e);
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
                                                                  HttpServletResponse response) {
        OAuth2AuthorizationRequest authRequest = loadAuthorizationRequest(request);
        if (authRequest != null) {
            deleteCookie(request, response);
        }
        return authRequest;
    }

    // ------------------------------------------------------------------ helpers

    private Optional<String> getCookieValue(HttpServletRequest request) {
        if (request.getCookies() == null) return Optional.empty();
        for (Cookie cookie : request.getCookies()) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                String value = cookie.getValue();
                return (value != null && !value.isBlank())
                        ? Optional.of(value)
                        : Optional.empty();
            }
        }
        return Optional.empty();
    }

    private Optional<OAuth2AuthorizationRequest> deserialize(String encoded) {
        try {
            String json = new String(Base64.getUrlDecoder().decode(encoded), StandardCharsets.UTF_8);
            AuthRequestDto dto = objectMapper.readValue(json, AuthRequestDto.class);
            return Optional.of(
                    OAuth2AuthorizationRequest.authorizationCode()
                            .authorizationUri(dto.authorizationUri())
                            .clientId(dto.clientId())
                            .redirectUri(dto.redirectUri())
                            .scopes(dto.scopes() != null
                                    ? new LinkedHashSet<>(dto.scopes())
                                    : new LinkedHashSet<>())
                            .state(dto.state())
                            .additionalParameters(dto.additionalParameters() != null
                                    ? dto.additionalParameters()
                                    : new HashMap<>())
                            .authorizationRequestUri(dto.authorizationRequestUri())
                            .attributes(dto.attributes() != null
                                    ? dto.attributes()
                                    : new HashMap<>())
                            .build()
            );
        } catch (Exception e) {
            log.warn("Error deserializando OAuth2AuthorizationRequest desde cookie: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private void deleteCookie(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() == null) return;
        for (Cookie cookie : request.getCookies()) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                response.addHeader(HttpHeaders.SET_COOKIE,
                        ResponseCookie.from(COOKIE_NAME, "")
                                .httpOnly(true)
                                .path("/")
                                .maxAge(0)
                                .sameSite("Lax")
                                .build().toString());
                break;
            }
        }
    }
}
