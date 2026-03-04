package com.jobfree.model.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobfree.model.enums.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Representa a los usuarios de la web JobFree.
 */
@Entity
@Table(name = "usuario")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(nullable = false, unique = true, length = 150)
	private String email;

	@Column(nullable = false, length = 20)
	private String telefono;

	// Permite enviar la contraseña en el POST pero no la devuelve en el GET por
	// seguridad
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(nullable = false, length = 255)
	private String password;

	// Rol del usuario dentro de la plataforma
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;

	@Column(length = 150)
	private String direccion;

	// Un usuario puede tener un perfil profesional si es profesional
	@JsonIgnore
	@OneToOne(mappedBy = "usuario")
	private ProfesionalInfo profesionalInfo;

	// Un cliente puede tener muchas reservas
	@JsonIgnore
	@OneToMany(mappedBy = "cliente")
	private List<Reserva> reservas;

	// Un cliente puede realizar muchas valoraciones
	@OneToMany(mappedBy = "cliente")
	@JsonIgnore
	private List<Valoracion> valoraciones;

	// Un usuario puede enviar muchos mensajes
	@JsonIgnore
	@OneToMany(mappedBy = "remitente")
	private List<Mensaje> mensajesEnviados;

	// Un usuario puede recibir muchos mensajes
	@JsonIgnore
	@OneToMany(mappedBy = "destinatario")
	private List<Mensaje> mensajesRecibidos;

	// Un usuario puede tener muchas notificaciones
	@JsonIgnore
	@OneToMany(mappedBy = "usuario")
	private List<Notificacion> notificaciones;

	// Constructor vacío obligatorio
	public Usuario() {
	}

	public Usuario(String nombre, String email, String telefono, String password, Rol rol, String direccion) {
		this.nombre = nombre;
		this.email = email;
		this.telefono = telefono;
		this.password = password;
		this.rol = rol;
		this.direccion = direccion;
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
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

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public ProfesionalInfo getProfesionalInfo() {
		return profesionalInfo;
	}

	public void setProfesionalInfo(ProfesionalInfo profesionalInfo) {
		this.profesionalInfo = profesionalInfo;
	}

	public List<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(List<Reserva> reservas) {
		this.reservas = reservas;
	}

	public List<Valoracion> getValoraciones() {
		return valoraciones;
	}

	public void setValoraciones(List<Valoracion> valoraciones) {
		this.valoraciones = valoraciones;
	}

	public List<Mensaje> getMensajesEnviados() {
		return mensajesEnviados;
	}

	public void setMensajesEnviados(List<Mensaje> mensajesEnviados) {
		this.mensajesEnviados = mensajesEnviados;
	}

	public List<Mensaje> getMensajesRecibidos() {
		return mensajesRecibidos;
	}

	public void setMensajesRecibidos(List<Mensaje> mensajesRecibidos) {
		this.mensajesRecibidos = mensajesRecibidos;
	}

	public List<Notificacion> getNotificaciones() {
		return notificaciones;
	}

	public void setNotificaciones(List<Notificacion> notificaciones) {
		this.notificaciones = notificaciones;
	}

}
