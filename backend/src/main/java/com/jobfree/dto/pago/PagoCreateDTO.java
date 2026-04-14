package com.jobfree.dto.pago;

import com.jobfree.model.enums.MetodoPago;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear un pago.
 */
public class PagoCreateDTO {

	@NotNull
	private MetodoPago metodo;

	@NotNull
	private Long reservaId;
	
	public MetodoPago getMetodo() {
		return metodo;
	}

	public void setMetodo(MetodoPago metodo) {
		this.metodo = metodo;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}

}
