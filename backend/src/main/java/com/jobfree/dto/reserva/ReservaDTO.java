package com.jobfree.dto.reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jobfree.model.enums.EstadoReserva;

/**
 * DTO para mostrar una reserva.
 */
public class ReservaDTO {

	private Long id;
    private LocalDateTime fechaInicio;
    private BigDecimal precioTotal;
    private EstadoReserva estado;

    private Long clienteId;
    private String clienteNombre;
    private Long servicioId;
    private String servicioTitulo;
    private Long profesionalId;
    private String profesionalNombre;

	public ReservaDTO() {
	}

	public ReservaDTO(Long id, LocalDateTime fechaInicio, BigDecimal precioTotal, EstadoReserva estado,
			Long clienteId, Long servicioId) {
		this.id = id;
		this.fechaInicio = fechaInicio;
		this.precioTotal = precioTotal;
		this.estado = estado;
		this.clienteId = clienteId;
		this.servicioId = servicioId;
	}

	// Getters

	public Long getId() { return id; }
	public LocalDateTime getFechaInicio() { return fechaInicio; }
	public BigDecimal getPrecioTotal() { return precioTotal; }
	public EstadoReserva getEstado() { return estado; }
	public Long getClienteId() { return clienteId; }
	public String getClienteNombre() { return clienteNombre; }
	public Long getServicioId() { return servicioId; }
	public String getServicioTitulo() { return servicioTitulo; }
	public Long getProfesionalId() { return profesionalId; }
	public String getProfesionalNombre() { return profesionalNombre; }

	// Setters extra (usados por el mapper)
	public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
	public void setServicioTitulo(String servicioTitulo) { this.servicioTitulo = servicioTitulo; }
	public void setProfesionalId(Long profesionalId) { this.profesionalId = profesionalId; }
	public void setProfesionalNombre(String profesionalNombre) { this.profesionalNombre = profesionalNombre; }

}
