package com.jobfree.model.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Representa un servicio publicado por un profesional.
 */
@Entity
@Table(name = "servicio_ofrecido")
public class ServicioOfrecido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	// Título obligatorio
	@NotBlank(message = "El título es obligatorio")
	@Column(nullable = false, length = 150)
	private String titulo;

	// Descripción obligatoria
	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false, length = 1000)
	private String descripcion;

	// Duración obligatoria y mayor que 0
	@NotNull(message = "La duración es obligatoria")
	@Positive(message = "La duración debe ser mayor que 0")
	@Column(nullable = false)
	private Integer duracionMin;

	// Precio obligatorio y mayor que 0
	@NotNull(message = "El precio por hora es obligatorio")
	@Positive(message = "El precio debe ser mayor que 0")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal precioHora;

	// Indica si el servicio esta activo en la web
	@Column(nullable = false)
	private boolean activa = true;

	// Muchos servicios pertenecen a un profesional
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "profesional_id", nullable = false)
	private ProfesionalInfo profesional;

	// Un servicio puede tener muchas reservas asociadas
	@OneToMany(mappedBy = "servicio", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Reserva> reservas;

	// Muchos servicios pueden pertenecer a una misma subcategoría
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subcategoria_id", nullable = false)
	private SubcategoriaServicio subcategoria;

	// Constructor vacío obligatorio
	public ServicioOfrecido() {
	}

	public ServicioOfrecido(String titulo, String descripcion, Integer duracionMin, BigDecimal precioHora,
			ProfesionalInfo profesional, SubcategoriaServicio subcategoria) {
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.duracionMin = duracionMin;
		this.precioHora = precioHora;
		this.profesional = profesional;
		this.subcategoria = subcategoria;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getDuracionMin() {
		return duracionMin;
	}

	public void setDuracionMin(Integer duracionMin) {
		this.duracionMin = duracionMin;
	}

	public BigDecimal getPrecioHora() {
		return precioHora;
	}

	public void setPrecioHora(BigDecimal precioHora) {
		this.precioHora = precioHora;
	}

	public boolean isActiva() {
		return activa;
	}

	public void setActiva(boolean activa) {
		this.activa = activa;
	}

	public ProfesionalInfo getProfesional() {
		return profesional;
	}

	public void setProfesional(ProfesionalInfo profesional) {
		this.profesional = profesional;
	}

	public List<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(List<Reserva> reservas) {
		this.reservas = reservas;
	}

	public SubcategoriaServicio getSubcategoria() {
		return subcategoria;
	}

	public void setSubcategoria(SubcategoriaServicio subcategoria) {
		this.subcategoria = subcategoria;
	}

}
