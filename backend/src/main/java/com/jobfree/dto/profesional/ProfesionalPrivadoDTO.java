package com.jobfree.dto.profesional;

import com.jobfree.model.enums.Plan;

/**
 * DTO para el propio profesional autenticado.
 * Incluye coordenadas para que pueda gestionar su ubicación desde el dashboard.
 */
public class ProfesionalPrivadoDTO {

    private Long id;
    private String descripcion;
    private Integer experiencia;
    private String nombreEmpresa;
    private String cif;
    private Plan plan;
    private String codigoPostal;
    private Double valoracionMedia;
    private Integer numeroValoraciones;
    private Long usuarioId;
    private Double latitud;
    private Double longitud;
    private Boolean ubicacionManual;

    public ProfesionalPrivadoDTO() {
    }

    public ProfesionalPrivadoDTO(Long id, String descripcion, Integer experiencia, String nombreEmpresa,
            String cif, Plan plan, String codigoPostal, Double valoracionMedia,
            Integer numeroValoraciones, Long usuarioId, Double latitud, Double longitud,
            Boolean ubicacionManual) {
        this.id = id;
        this.descripcion = descripcion;
        this.experiencia = experiencia;
        this.nombreEmpresa = nombreEmpresa;
        this.cif = cif;
        this.plan = plan;
        this.codigoPostal = codigoPostal;
        this.valoracionMedia = valoracionMedia;
        this.numeroValoraciones = numeroValoraciones;
        this.usuarioId = usuarioId;
        this.latitud = latitud;
        this.longitud = longitud;
        this.ubicacionManual = ubicacionManual;
    }

    public Long getId() { return id; }
    public String getDescripcion() { return descripcion; }
    public Integer getExperiencia() { return experiencia; }
    public String getNombreEmpresa() { return nombreEmpresa; }
    public String getCif() { return cif; }
    public Plan getPlan() { return plan; }
    public String getCodigoPostal() { return codigoPostal; }
    public Double getValoracionMedia() { return valoracionMedia; }
    public Integer getNumeroValoraciones() { return numeroValoraciones; }
    public Long getUsuarioId() { return usuarioId; }
    public Double getLatitud() { return latitud; }
    public Double getLongitud() { return longitud; }
    public Boolean getUbicacionManual() { return ubicacionManual; }
}
