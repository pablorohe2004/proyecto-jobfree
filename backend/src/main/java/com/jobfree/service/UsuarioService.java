package com.jobfree.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobfree.dto.usuario.UsuarioCreateDTO;
import com.jobfree.dto.usuario.UsuarioUpdateDTO;
import com.jobfree.exception.usuario.UsuarioAdminNoPermitidoException;
import com.jobfree.exception.usuario.UsuarioDuplicadoException;
import com.jobfree.exception.usuario.UsuarioNotFoundException;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Obtiene todos los usuarios.
	 * 
	 * @return lista de usuarios
	 */
	public List<Usuario> listarUsuarios() {
		return usuarioRepository.findAll();
	}

	/**
	 * Obtiene un usuario por su ID.
	 * 
	 * @param id identificador del usuario
	 * @return usuario encontrado
	 */
	public Usuario obtenerPorId(Long id) {
		return usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNotFoundException(id));
	}

	/**
	 * Crea un usuario validando rol y duplicados.
	 * 
	 * @param usuario entidad usuario
	 * @return usuario guardado
	 */
	public Usuario crearUsuario(Usuario usuario) {

		if (usuario.getRol() == null) {
			usuario.setRol(Rol.CLIENTE);
		}

		if (usuario.getRol() == Rol.ADMIN) {
			throw new UsuarioAdminNoPermitidoException();
		}

		if (usuarioRepository.existsByEmail(usuario.getEmail())) {
			throw new UsuarioDuplicadoException("email");
		}

		if (usuarioRepository.existsByTelefono(usuario.getTelefono())) {
			throw new UsuarioDuplicadoException("teléfono");
		}

		return usuarioRepository.save(usuario);
	}

	/**
	 * Crea un usuario con rol CLIENTE.
	 * 
	 * @param dto datos de creación
	 * @return usuario creado
	 */
	public Usuario crearCliente(UsuarioCreateDTO dto) {
		Usuario u = UsuarioMapper.toEntity(dto);
		u.setRol(Rol.CLIENTE);
		u.setPassword(passwordEncoder.encode(dto.getPassword()));
		return crearUsuario(u);
	}

	/**
	 * Crea un usuario con rol PROFESIONAL.
	 * 
	 * @param dto datos de creación
	 * @return usuario creado
	 */
	public Usuario crearProfesional(UsuarioCreateDTO dto) {
		Usuario u = UsuarioMapper.toEntity(dto);
		u.setRol(Rol.PROFESIONAL);
		u.setPassword(passwordEncoder.encode(dto.getPassword()));
		return crearUsuario(u);
	}

	/**
	 * Actualiza un usuario existente.
	 * 
	 * @param id    identificador del usuario
	 * @param datos nuevos datos
	 * @return usuario actualizado
	 */
	public Usuario actualizarUsuario(Long id, Usuario datos) {

		Usuario existente = obtenerPorId(id);

		if (datos.getApellidos() != null && !datos.getApellidos().isBlank()) {
			existente.setApellidos(datos.getApellidos());
		}

		if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
			existente.setNombre(datos.getNombre());
		}

		if (datos.getEmail() != null && !datos.getEmail().isBlank()) {

			if (!datos.getEmail().equals(existente.getEmail()) && usuarioRepository.existsByEmail(datos.getEmail())) {

				throw new UsuarioDuplicadoException("email");
			}

			existente.setEmail(datos.getEmail());
		}

		if (datos.getTelefono() != null && !datos.getTelefono().isBlank()) {

			if (!datos.getTelefono().equals(existente.getTelefono())
					&& usuarioRepository.existsByTelefono(datos.getTelefono())) {

				throw new UsuarioDuplicadoException("teléfono");
			}

			existente.setTelefono(datos.getTelefono());
		}

		if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
			existente.setPassword(passwordEncoder.encode(datos.getPassword()));
		}

		if (datos.getDireccion() != null && !datos.getDireccion().isBlank()) {
			existente.setDireccion(datos.getDireccion());
		}

		if (datos.getCiudad() != null && !datos.getCiudad().isBlank()) {
			existente.setCiudad(datos.getCiudad());
		}

		return usuarioRepository.save(existente);
	}

	/**
	 * Actualiza un usuario a partir de un DTO.
	 * 
	 * @param id  identificador del usuario
	 * @param dto datos a actualizar
	 * @return usuario actualizado
	 */
	public Usuario actualizarUsuarioDesdeDTO(Long id, UsuarioUpdateDTO dto) {

		Usuario datos = UsuarioMapper.toEntity(dto);

		return actualizarUsuario(id, datos);
	}

	/**
	 * Elimina un usuario por ID.
	 * 
	 * @param id identificador del usuario
	 */
	public void eliminarUsuario(Long id) {
		Usuario usuario = obtenerPorId(id);
		usuarioRepository.delete(usuario);
	}

}