package com.jobfree.dto.profesional;

import com.jobfree.model.enums.Plan;

/**
 * DTO para mostrar un perfil profesional.
 */
public class ProfesionalDTO {

	private Long id;
	private String descripcion;
	private Integer experiencia;
	private String nombreEmpresa;
	private String cif;
	private Plan plan;

	private Double valoracionMedia;
	private Integer numeroValoraciones;

	private Long usuarioId;

	public ProfesionalDTO() {
	}

	public ProfesionalDTO(Long id, String descripcion, Integer experiencia, String nombreEmpresa, String cif, Plan plan,
			Double valoracionMedia, Integer numeroValoraciones, Long usuarioId) {
		this.id = id;
		this.descripcion = descripcion;
		this.experiencia = experiencia;
		this.nombreEmpresa = nombreEmpresa;
		this.cif = cif;
		this.plan = plan;
		this.valoracionMedia = valoracionMedia;
		this.numeroValoraciones = numeroValoraciones;
		this.usuarioId = usuarioId;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public Integer getExperiencia() {
		return experiencia;
	}

	public String getNombreEmpresa() {
		return nombreEmpresa;
	}

	public String getCif() {
		return cif;
	}

	public Plan getPlan() {
		return plan;
	}

	public Double getValoracionMedia() {
		return valoracionMedia;
	}

	public Integer getNumeroValoraciones() {
		return numeroValoraciones;
	}

	public Long getUsuarioId() {
		return usuarioId;
	}

}
