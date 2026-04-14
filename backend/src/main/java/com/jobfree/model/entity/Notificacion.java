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
 * Representa una notificacion que recibe un usuario en la web.
 */
@Entity
@Table(name = "notificacion")
public class Notificacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	@NotBlank(message = "El mensaje es obligatorio")
	@Column(nullable = false, length = 300)
	private String mensaje;

	@Column(nullable = false)
	private boolean leida = false;

	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	@PrePersist
	public void prePersist() {
		this.fechaCreacion = LocalDateTime.now();
	}

	// Muchas notificaciones pertenecen a un usuario
	@NotNull(message = "El usuario es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "usuario_id", nullable = false)
	private Usuario usuario;

	// Constructor vacío obligatorio
	public Notificacion() {
	}

	public Notificacion(String mensaje, Usuario usuario) {
		this.mensaje = mensaje;
		this.usuario = usuario;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

	public boolean isLeida() {
		return leida;
	}

	public void setLeida(boolean leida) {
		this.leida = leida;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

}
