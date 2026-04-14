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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Representa la valoración que un cliente deja después de una reserva.
 */
@Entity
@Table(name = "valoracion")
public class Valoracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	// Puntuación del servicio (entre 1 y 5 estrellas)
	@NotNull(message = "Las estrellas son obligatorias")
	@Min(value = 1, message = "La puntuación mínima es 1")
	@Max(value = 5, message = "La puntuación máxima es 5")
	@Column(nullable = false)
	private Integer estrellas;

	// Comentario opcional del cliente
	@Size(max = 1000, message = "El comentario no puede superar los 1000 caracteres")
	@Column(length = 1000)
	private String comentario;

	// Fecha en la que se realiza la valoración
	@Column(nullable = false, updatable = false)
	private LocalDateTime fecha;

	// Una valoración pertenece a una reserva
	@OneToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "reserva_id", nullable = false, unique = true)
	private Reserva reserva;

	// Muchas valoraciones pertenecen a un cliente
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Muchas valoraciones pertenecen a un profesional
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "profesional_id", nullable = false)
	private ProfesionalInfo profesional;

	// Constructor vacío obligatorio
	public Valoracion() {
	}

	public Valoracion(Integer estrellas, String comentario, Reserva reserva, Usuario cliente,
			ProfesionalInfo profesional) {
		this.estrellas = estrellas;
		this.comentario = comentario;
		this.reserva = reserva;
		this.cliente = cliente;
		this.profesional = profesional;
	}

	@PrePersist
	public void prePersist() {
		this.fecha = LocalDateTime.now();
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public Integer getEstrellas() {
		return estrellas;
	}

	public void setEstrellas(Integer estrellas) {
		this.estrellas = estrellas;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
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

}
