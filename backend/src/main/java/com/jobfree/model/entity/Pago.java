package com.jobfree.model.entity;

import java.time.LocalDateTime;

import com.jobfree.model.enums.EstadoPago;
import com.jobfree.model.enums.MetodoPago;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa el pago asociado a una reserva.
 */
@Entity
@Table(name = "pago")
public class Pago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Double importe;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MetodoPago metodo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoPago estado = EstadoPago.PENDIENTE;

	@Column(nullable = false)
	private LocalDateTime fechaPago;

	// Un pago pertenece a una reserva
	@OneToOne
	@JoinColumn(name = "reserva_id", nullable = false, unique = true)
	private Reserva reserva;

	// Constructor vacío obligatorio
	public Pago() {
	}

	public Pago(Double importe, MetodoPago metodo, LocalDateTime fechaPago, Reserva reserva) {
		this.importe = importe;
		this.metodo = metodo;
		this.fechaPago = fechaPago;
		this.reserva = reserva;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public Double getImporte() {
		return importe;
	}

	public void setImporte(Double importe) {
		this.importe = importe;
	}

	public MetodoPago getMetodo() {
		return metodo;
	}

	public void setMetodo(MetodoPago metodo) {
		this.metodo = metodo;
	}

	public EstadoPago getEstado() {
		return estado;
	}

	public void setEstado(EstadoPago estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaPago() {
		return fechaPago;
	}

	public void setFechaPago(LocalDateTime fechaPago) {
		this.fechaPago = fechaPago;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}

}
