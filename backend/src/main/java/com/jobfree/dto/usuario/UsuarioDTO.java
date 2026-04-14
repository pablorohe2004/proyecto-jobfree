package com.jobfree.dto.usuario;

/**
 * DTO para mostrar la información de un usuario.
 */
public class UsuarioDTO {

	private Long id;
	private String nombreCompleto;
	private String email;
	private String ciudad;
	private String rol;

	public UsuarioDTO() {
	}

	public UsuarioDTO(Long id, String nombreCompleto, String email, String ciudad, String rol) {
		this.id = id;
		this.nombreCompleto = nombreCompleto;
		this.email = email;
		this.ciudad = ciudad;
		this.rol = rol;
	}

	// Getters

	public Long getId() {
		return id;
	}

	public String getNombreCompleto() {
		return nombreCompleto;
	}

	public String getEmail() {
		return email;
	}

	public String getCiudad() {
		return ciudad;
	}

	public String getRol() {
		return rol;
	}

}
