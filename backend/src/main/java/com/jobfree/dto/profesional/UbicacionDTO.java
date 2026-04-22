package com.jobfree.dto.profesional;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para actualizar la ubicación GPS de un profesional desde el frontend.
 */
public class UbicacionDTO {

    @NotNull(message = "La latitud es obligatoria")
    @DecimalMin(value = "-90.0",  message = "Latitud fuera de rango")
    @DecimalMax(value = "90.0",   message = "Latitud fuera de rango")
    private Double latitud;

    @NotNull(message = "La longitud es obligatoria")
    @DecimalMin(value = "-180.0", message = "Longitud fuera de rango")
    @DecimalMax(value = "180.0",  message = "Longitud fuera de rango")
    private Double longitud;

    public Double getLatitud()  { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
}
