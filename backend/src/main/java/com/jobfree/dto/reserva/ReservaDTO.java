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
    private Long servicioId; 
    
	public ReservaDTO() {
	}

	public ReservaDTO(Long id, LocalDateTime fechaInicio, BigDecimal precioTotal, EstadoReserva estado, Long clienteId,
			Long servicioId) {
		this.id = id;
		this.fechaInicio = fechaInicio;
		this.precioTotal = precioTotal;
		this.estado = estado;
		this.clienteId = clienteId;
		this.servicioId = servicioId;
	}

	// Getters
	
	public Long getId() {
		return id;
	}

	public LocalDateTime getFechaInicio() {
		return fechaInicio;
	}

	public BigDecimal getPrecioTotal() {
		return precioTotal;
	}

	public EstadoReserva getEstado() {
		return estado;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public Long getServicioId() {
		return servicioId;
	}

}
