package com.jobfree.util;

public class GeoUtils {

    private static final double RADIO_TIERRA_KM = 6371.0;

    private GeoUtils() {}

    /**
     * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine.
     */
    public static double calcularDistanciaKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIO_TIERRA_KM * c;
    }

    /** Redondea a un decimal (p.ej. 12.456 → 12.5). */
    public static double redondear1Decimal(double valor) {
        return Math.round(valor * 10.0) / 10.0;
    }
}
