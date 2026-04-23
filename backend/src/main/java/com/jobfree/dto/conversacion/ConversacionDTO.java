package com.jobfree.dto.conversacion;

import java.time.LocalDateTime;

public class ConversacionDTO {

	private Long id;
	private Long reservaId;
	private LocalDateTime fechaCreacion;

	private Long clienteId;
	private String clienteNombre;
	private String clienteFotoUrl;

	private Long profesionalId;
	private String profesionalNombre;
	private String profesionalFotoUrl;

	private String servicioTitulo;
	private String ultimoMensaje;
	private LocalDateTime fechaUltimoMensaje;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getReservaId() {
		return reservaId;
	}

	public void setReservaId(Long reservaId) {
		this.reservaId = reservaId;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public String getClienteNombre() {
		return clienteNombre;
	}

	public void setClienteNombre(String clienteNombre) {
		this.clienteNombre = clienteNombre;
	}

	public String getClienteFotoUrl() {
		return clienteFotoUrl;
	}

	public void setClienteFotoUrl(String clienteFotoUrl) {
		this.clienteFotoUrl = clienteFotoUrl;
	}

	public Long getProfesionalId() {
		return profesionalId;
	}

	public void setProfesionalId(Long profesionalId) {
		this.profesionalId = profesionalId;
	}

	public String getProfesionalNombre() {
		return profesionalNombre;
	}

	public void setProfesionalNombre(String profesionalNombre) {
		this.profesionalNombre = profesionalNombre;
	}

	public String getProfesionalFotoUrl() {
		return profesionalFotoUrl;
	}

	public void setProfesionalFotoUrl(String profesionalFotoUrl) {
		this.profesionalFotoUrl = profesionalFotoUrl;
	}

	public String getServicioTitulo() {
		return servicioTitulo;
	}

	public void setServicioTitulo(String servicioTitulo) {
		this.servicioTitulo = servicioTitulo;
	}

	public String getUltimoMensaje() {
		return ultimoMensaje;
	}

	public void setUltimoMensaje(String ultimoMensaje) {
		this.ultimoMensaje = ultimoMensaje;
	}

	public LocalDateTime getFechaUltimoMensaje() {
		return fechaUltimoMensaje;
	}

	public void setFechaUltimoMensaje(LocalDateTime fechaUltimoMensaje) {
		this.fechaUltimoMensaje = fechaUltimoMensaje;
	}
}
