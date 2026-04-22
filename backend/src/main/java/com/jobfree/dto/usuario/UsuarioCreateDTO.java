package com.jobfree.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear un usuario con los datos básicos.
 */
public class UsuarioCreateDTO {

	@NotBlank
	private String nombre;

	@NotBlank
	private String apellidos;

	@NotBlank
	@Email
	private String email;

	@NotBlank
	private String telefono;

	@NotBlank
	@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
	@jakarta.validation.constraints.Pattern(
		regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
		message = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
	)
	private String password;

	private String direccion;
	private String ciudad;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

}
