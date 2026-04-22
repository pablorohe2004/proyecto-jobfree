package com.jobfree.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/**
 * Convierte ciudad + código postal en coordenadas (lat, lng)
 * usando la API gratuita de Nominatim (OpenStreetMap).
 * No requiere clave de API ni dependencias extra.
 */
@Service
public class GeocodingService {

    private static final Logger log = LoggerFactory.getLogger(GeocodingService.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeocodingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    /**
     * Geocodifica una localización española.
     *
     * @param ciudad       nombre de la ciudad (puede ser null)
     * @param codigoPostal código postal (puede ser null)
     * @return array [latitud, longitud] o null si no se pudo geocodificar
     */
    public double[] geocodificar(String ciudad, String codigoPostal) {
        String query = construirQuery(ciudad, codigoPostal);
        if (query.isBlank()) return null;

        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + URLEncoder.encode(query, StandardCharsets.UTF_8)
                    + "&format=json&limit=1&countrycodes=es";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "JobFreeApp/1.0 contacto@jobfree.es")
                    .timeout(Duration.ofSeconds(8))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Geocodificación fallida para '{}': HTTP {}", query, response.statusCode());
                return null;
            }

            JsonNode[] nodes = objectMapper.readValue(response.body(), JsonNode[].class);

            if (nodes.length > 0) {
                double lat = nodes[0].get("lat").asDouble();
                double lon = nodes[0].get("lon").asDouble();
                return new double[]{lat, lon};
            }

        } catch (Exception ex) {
            // No bloqueamos el guardado del perfil si la geocodificación falla
            log.warn("No se pudo geocodificar '{}': {}", query, ex.getMessage());
        }
        return null;
    }

    private String construirQuery(String ciudad, String codigoPostal) {
        StringBuilder sb = new StringBuilder();
        if (codigoPostal != null && !codigoPostal.isBlank()) {
            sb.append(codigoPostal.trim());
        }
        if (ciudad != null && !ciudad.isBlank()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(ciudad.trim());
        }
        if (sb.length() > 0) sb.append(", España");
        return sb.toString();
    }
}
