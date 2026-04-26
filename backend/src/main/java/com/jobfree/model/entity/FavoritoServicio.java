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
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

/**
 * Representa un servicio marcado como favorito por un cliente.
 */
@Entity
@Table(name = "favorito_servicio", uniqueConstraints = {
	@UniqueConstraint(columnNames = {"cliente_id", "servicio_id"}, name = "UK_cliente_servicio")
})
public class FavoritoServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;

	// Fecha en la que se marca como favorito
	@Column(nullable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	// Un favorito pertenece a un cliente
	@NotNull(message = "El cliente es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Un favorito pertenece a un servicio
	@NotNull(message = "El servicio es obligatorio")
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	@JoinColumn(name = "servicio_id", nullable = false)
	private ServicioOfrecido servicio;

	// Constructor vacío obligatorio
	public FavoritoServicio() {
	}

	public FavoritoServicio(Usuario cliente, ServicioOfrecido servicio) {
		this.cliente = cliente;
		this.servicio = servicio;
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

	public ServicioOfrecido getServicio() {
		return servicio;
	}

	public void setServicio(ServicioOfrecido servicio) {
		this.servicio = servicio;
	}
}
