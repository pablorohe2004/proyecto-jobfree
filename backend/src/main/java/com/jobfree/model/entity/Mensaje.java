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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Representa un mensaje enviado entre usuarios.
 */
@Entity
@Table(name = "mensaje")
public class Mensaje {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotBlank(message = "El contenido es obligatorio")
	@Column(nullable = false, length = 1000)
	private String contenido;

	@Column(nullable = false)
	private boolean leido = false;

	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaEnvio;

	@PrePersist
	public void prePersist() {
		this.fechaEnvio = LocalDateTime.now();
	}

	// Muchos mensajes pueden ser enviados por un mismo usuario
	@NotNull(message = "El remitente es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "remitente_id", nullable = false)
	private Usuario remitente;

	// Muchos mensajes pueden ser recibidos por un mismo usuario
	@NotNull(message = "El destinatario es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "destinatario_id", nullable = false)
	private Usuario destinatario;

	// Muchos mensajes pueden estar asociados a la misma reserva (puede tener varios
	// mensajes en la misma conversacion)
	@NotNull(message = "La reserva es obligatoria")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "reserva_id", nullable = false)
	private Reserva reserva;

	// Constructor vacío obligatorio
	public Mensaje() {
	}

	public Mensaje(String contenido, Usuario remitente, Usuario destinatario, Reserva reserva) {
		this.contenido = contenido;
		this.remitente = remitente;
		this.destinatario = destinatario;
		this.reserva = reserva;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public boolean isLeido() {
		return leido;
	}

	public void setLeido(boolean leido) {
		this.leido = leido;
	}

	public LocalDateTime getFechaEnvio() {
		return fechaEnvio;
	}

	public Usuario getRemitente() {
		return remitente;
	}

	public void setRemitente(Usuario remitente) {
		this.remitente = remitente;
	}

	public Usuario getDestinatario() {
		return destinatario;
	}

	public void setDestinatario(Usuario destinatario) {
		this.destinatario = destinatario;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}

}
