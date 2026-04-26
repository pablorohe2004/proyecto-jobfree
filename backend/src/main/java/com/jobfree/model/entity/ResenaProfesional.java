package com.jobfree.model.entity;

import java.time.LocalDateTime;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Representa una reseña que un cliente deja sobre un profesional.
 */
@Entity
@Table(name = "resena_profesional")
public class ResenaProfesional {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	// Puntuación de la reseña (entre 1 y 5 estrellas)
	@NotNull(message = "La calificación es obligatoria")
	@Min(value = 1, message = "La calificación mínima es 1")
	@Max(value = 5, message = "La calificación máxima es 5")
	@Column(nullable = false)
	private Integer calificacion;

	// Comentario de la reseña
	@NotBlank(message = "El comentario no puede estar vacío")
	@Size(min = 10, max = 1000, message = "El comentario debe tener entre 10 y 1000 caracteres")
	@Column(nullable = false, length = 1000)
	private String comentario;

	// Fecha en la que se realiza la reseña
	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	// Una reseña es dejada por un cliente
	@NotNull(message = "El cliente es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Una reseña es sobre un profesional
	@NotNull(message = "El profesional es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "profesional_id", nullable = false)
	private ProfesionalInfo profesional;

	// Una reseña puede estar asociada a una reserva específica (opcional)
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "reserva_id")
	private Reserva reserva;

	// Constructor vacío obligatorio
	public ResenaProfesional() {
	}

	public ResenaProfesional(Integer calificacion, String comentario, Usuario cliente, ProfesionalInfo profesional) {
		this.calificacion = calificacion;
		this.comentario = comentario;
		this.cliente = cliente;
		this.profesional = profesional;
	}

	public ResenaProfesional(Integer calificacion, String comentario, Usuario cliente, ProfesionalInfo profesional,
			Reserva reserva) {
		this.calificacion = calificacion;
		this.comentario = comentario;
		this.cliente = cliente;
		this.profesional = profesional;
		this.reserva = reserva;
	}

	@PrePersist
	public void prePersist() {
		this.fechaCreacion = LocalDateTime.now();
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getCalificacion() {
		return calificacion;
	}

	public void setCalificacion(Integer calificacion) {
		this.calificacion = calificacion;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Usuario getCliente() {
		return cliente;
	}

	public void setCliente(Usuario cliente) {
		this.cliente = cliente;
	}

	public ProfesionalInfo getProfesional() {
		return profesional;
	}

	public void setProfesional(ProfesionalInfo profesional) {
		this.profesional = profesional;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}
}
