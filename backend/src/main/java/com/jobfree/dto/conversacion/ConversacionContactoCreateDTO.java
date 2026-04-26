package com.jobfree.dto.conversacion;

import jakarta.validation.constraints.NotNull;

public class ConversacionContactoCreateDTO {

	@NotNull
	private Long profesionalId;

	public Long getProfesionalId() {
		return profesionalId;
	}

	public void setProfesionalId(Long profesionalId) {
		this.profesionalId = profesionalId;
	}
}
