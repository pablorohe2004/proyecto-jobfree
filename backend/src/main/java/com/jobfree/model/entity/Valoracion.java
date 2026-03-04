package com.jobfree.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa la valoración que un cliente deja después de una reserva.
 */
@Entity
@Table(name = "valoracion")
public class Valoracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer estrellas; // 1 a 5

	@Column(length = 1000)
	private String comentario;

	@Column(nullable = false)
	private LocalDateTime fecha;

	// Una valoración pertenece a una reserva
	@OneToOne
	@JoinColumn(name = "reserva_id", nullable = false, unique = true)
	private Reserva reserva;

	// Muchas valoraciones pertenecen a un cliente
	@ManyToOne
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Muchas valoraciones pertenecen a un profesional
	@ManyToOne
	@JoinColumn(name = "profesional_id", nullable = false)
	private ProfesionalInfo profesional;

	// Constructor vacío obligatorio
	public Valoracion() {
	}

	public Valoracion(Integer estrellas, String comentario, LocalDateTime fecha, Reserva reserva, Usuario cliente,
			ProfesionalInfo profesional) {
		this.estrellas = estrellas;
		this.comentario = comentario;
		this.fecha = fecha;
		this.reserva = reserva;
		this.cliente = cliente;
		this.profesional = profesional;
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

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
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
