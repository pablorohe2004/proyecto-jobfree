package com.jobfree.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jobfree.model.enums.EstadoReserva;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa una reserva realizada por un cliente para contratar un servicio
 * ofrecido.
 */
@Entity
@Table(name = "reserva")
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Fecha y hora de inicio del servicio
	@Column(nullable = false)
	private LocalDateTime fechaInicio;

	@Column(nullable = false)
	private Double precioTotal;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoReserva estado;

	// Muchas reservas pertenecen a un cliente
	@ManyToOne
	@JoinColumn(name = "cliente_id", nullable = false)
	private Usuario cliente;

	// Muchas reservas pueden estar asociadas al mismo servicio
	@ManyToOne
	@JoinColumn(name = "servicio_id", nullable = false)
	private ServicioOfrecido servicio;

	// Una reserva puede tener un pago asociado
	@OneToOne(mappedBy = "reserva")
	@JsonIgnore
	private Pago pago;

	// Una reserva puede tener una valoración asociada
	@OneToOne(mappedBy = "reserva")
	@JsonIgnore
	private Valoracion valoracion;

	// Una reserva puede tener muchos mensajes asociados
	@JsonIgnore
	@OneToMany(mappedBy = "reserva")
	private List<Mensaje> mensajes;

	// Constructor vacío obligatorio
	public Reserva() {
	}

	public Reserva(LocalDateTime fechaInicio, Double precioTotal, EstadoReserva estado, Usuario cliente,
			ServicioOfrecido servicio) {
		this.fechaInicio = fechaInicio;
		this.precioTotal = precioTotal;
		this.estado = estado;
		this.cliente = cliente;
		this.servicio = servicio;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public LocalDateTime getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDateTime fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public Double getPrecioTotal() {
		return precioTotal;
	}

	public void setPrecioTotal(Double precioTotal) {
		this.precioTotal = precioTotal;
	}

	public EstadoReserva getEstado() {
		return estado;
	}

	public void setEstado(EstadoReserva estado) {
		this.estado = estado;
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

	public Pago getPago() {
		return pago;
	}

	public void setPago(Pago pago) {
		this.pago = pago;
	}

	public Valoracion getValoracion() {
		return valoracion;
	}

	public void setValoracion(Valoracion valoracion) {
		this.valoracion = valoracion;
	}

	public List<Mensaje> getMensajes() {
		return mensajes;
	}

	public void setMensajes(List<Mensaje> mensajes) {
		this.mensajes = mensajes;
	}

}
