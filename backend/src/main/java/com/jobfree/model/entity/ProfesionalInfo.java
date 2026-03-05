package com.jobfree.model.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jobfree.model.enums.Plan;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa la información profesional de un usuario.
 */
@Entity
@Table(name = "profesional_info")
public class ProfesionalInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 500)
	private String descripcion;

	@Column(nullable = false)
	private Integer experiencia; // años de experiencia

	@Column(length = 100)
	private String nombreEmpresa;

	@Column(length = 20)
	private String cif;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Plan plan;

	// Se actualiza cuando reciba valoraciones
	private Double valoracionMedia = 0.0;

	// Número de valoraciones que ha recibido el profesional
	private Integer numeroValoraciones = 0;

	// Cada profesional tiene un unico perfil profesional
	@OneToOne
	@JoinColumn(name = "usuario_id", nullable = false, unique = true)
	private Usuario usuario;

	// Un profesional puede ofrecer muchos servicios
	@JsonIgnore
	@OneToMany(mappedBy = "profesional")
	private List<ServicioOfrecido> servicios;

	// Un profesional puede recibir muchas valoraciones
	@JsonIgnore
	@OneToMany(mappedBy = "profesional")
	private List<Valoracion> valoraciones;

	// Constructor vacío obligatorio
	public ProfesionalInfo() {
	}

	public ProfesionalInfo(Usuario usuario, String descripcion, Integer experiencia, String nombreEmpresa, String cif,
			Plan plan) {
		this.usuario = usuario;
		this.descripcion = descripcion;
		this.experiencia = experiencia;
		this.nombreEmpresa = nombreEmpresa;
		this.cif = cif;
		this.plan = plan;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getExperiencia() {
		return experiencia;
	}

	public void setExperiencia(Integer experiencia) {
		this.experiencia = experiencia;
	}

	public String getNombreEmpresa() {
		return nombreEmpresa;
	}

	public void setNombreEmpresa(String nombreEmpresa) {
		this.nombreEmpresa = nombreEmpresa;
	}

	public String getCif() {
		return cif;
	}

	public void setCif(String cif) {
		this.cif = cif;
	}

	public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

	public Double getValoracionMedia() {
		return valoracionMedia;
	}

	public void setValoracionMedia(Double valoracionMedia) {
		this.valoracionMedia = valoracionMedia;
	}

	public Integer getNumeroValoraciones() {
		return numeroValoraciones;
	}

	public void setNumeroValoraciones(Integer numeroValoraciones) {
		this.numeroValoraciones = numeroValoraciones;
	}

	public List<ServicioOfrecido> getServicios() {
		return servicios;
	}

	public void setServicios(List<ServicioOfrecido> servicios) {
		this.servicios = servicios;
	}

	public List<Valoracion> getValoraciones() {
		return valoraciones;
	}

	public void setValoraciones(List<Valoracion> valoraciones) {
		this.valoraciones = valoraciones;
	}

}
