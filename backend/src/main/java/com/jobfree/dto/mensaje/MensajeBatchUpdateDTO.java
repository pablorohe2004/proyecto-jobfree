package com.jobfree.dto.mensaje;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class MensajeBatchUpdateDTO {

	@NotEmpty(message = "Debes indicar al menos un mensaje")
	private List<@NotNull(message = "El id del mensaje es obligatorio") Long> mensajeIds;

	public MensajeBatchUpdateDTO() {
	}

	public List<Long> getMensajeIds() {
		return mensajeIds;
	}

	public void setMensajeIds(List<Long> mensajeIds) {
		this.mensajeIds = mensajeIds;
	}
}
