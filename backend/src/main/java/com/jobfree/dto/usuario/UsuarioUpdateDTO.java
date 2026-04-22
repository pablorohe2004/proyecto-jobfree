package com.jobfree.dto.usuario;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO para actualizar los datos de un usuario.
 */
public class UsuarioUpdateDTO {

	private String nombre;

	private String apellidos;

	// Permite cadena vacía (sin cambio) o teléfono con prefijo internacional
	@Pattern(regexp = "^$|^\\+?[\\d\\s\\-]{6,20}$", message = "Teléfono no válido")
	private String telefono;

	// Null = no cambiar contraseña; si se envía debe tener 8+ caracteres
	@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
	private String password;

	private String direccion;

	private String ciudad;

	private String fotoUrl;

	// Getters y setters

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

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}

}
