package com.jobfree.model.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Representa un servicio publicado por un profesional.
 */
@Entity
@Table(name = "servicio_ofrecido")
public class ServicioOfrecido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String titulo;

	@Column(nullable = false, length = 1000)
	private String descripcion;

	@Column(nullable = false)
	private Integer duracionMin; // duracion estimada en minutos

	@Column(nullable = false)
	private Double precioHora;

	// Indica si el servicio esta activo en la web
	@Column(nullable = false)
	private boolean activa = true;

	// Muchos servicios pertenecen a un profesional
	@ManyToOne
	@JoinColumn(name = "profesional_id", nullable = false)
	private ProfesionalInfo profesional;

	// Muchos servicios pertenecen a una categoría
	@ManyToOne
	@JoinColumn(name = "categoria_id", nullable = false)
	private CategoriaServicio categoria;

	// Un servicio puede tener muchas reservas asociadas
	@OneToMany(mappedBy = "servicio")
	@JsonIgnore
	private List<Reserva> reservas;

	// Constructor vacío obligatorio
	public ServicioOfrecido() {
	}

	public ServicioOfrecido(String titulo, String descripcion, Integer duracionMin, Double precioHora,
			ProfesionalInfo profesional, CategoriaServicio categoria) {
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.duracionMin = duracionMin;
		this.precioHora = precioHora;
		this.profesional = profesional;
		this.categoria = categoria;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Double getPrecioHora() {
		return precioHora;
	}

	public void setPrecioHora(Double precioHora) {
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

	public CategoriaServicio getCategoria() {
		return categoria;
	}

	public void setCategoria(CategoriaServicio categoria) {
		this.categoria = categoria;
	}

	public List<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(List<Reserva> reservas) {
		this.reservas = reservas;
	}

}
