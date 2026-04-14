package com.jobfree.dto.pago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para mostrar un pago.
 */
public class PagoDTO {

	private Long id;
	private BigDecimal importe;
	private String metodo;
	private String estado;
	private LocalDateTime fechaPago;
	private Long reservaId;

	public PagoDTO() {
	}

	public PagoDTO(Long id, BigDecimal importe, String metodo, String estado, LocalDateTime fechaPago, Long reservaId) {
		this.id = id;
		this.importe = importe;
		this.metodo = metodo;
		this.estado = estado;
		this.fechaPago = fechaPago;
		this.reservaId = reservaId;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public BigDecimal getImporte() {
		return importe;
	}

	public String getMetodo() {
		return metodo;
	}

	public String getEstado() {
		return estado;
	}

	public LocalDateTime getFechaPago() {
		return fechaPago;
	}

	public Long getReservaId() {
		return reservaId;
	}

}
