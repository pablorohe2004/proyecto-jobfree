package com.jobfree.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Representa una notificacion que recibe un usuario en la web.
 */
@Entity
@Table(name = "notificacion")
public class Notificacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 300)
	private String mensaje;

	@Column(nullable = false)
	private boolean leida = false;

	@Column(nullable = false)
	private LocalDateTime fechaCreacion = LocalDateTime.now();

	// Muchas notificaciones pertenecen a un usuario
	@ManyToOne
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

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

}
