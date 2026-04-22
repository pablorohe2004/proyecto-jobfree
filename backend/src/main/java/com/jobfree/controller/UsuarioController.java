package com.jobfree.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobfree.dto.usuario.UsuarioCreateDTO;
import com.jobfree.dto.usuario.UsuarioDTO;
import com.jobfree.dto.usuario.UsuarioUpdateDTO;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	private final UsuarioService usuarioService;

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@Value("${frontend.url}")
	private String frontendUrl;

	public UsuarioController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	/**
	 * Actualiza los datos del usuario autenticado (sin necesidad de pasar el ID por URL).
	 */
	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/me")
	public ResponseEntity<UsuarioDTO> actualizarMe(@Valid @RequestBody UsuarioUpdateDTO dto) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Usuario actualizado = usuarioService.actualizarUsuarioDesdeDTO(usuario.getId(), dto);
		return ResponseEntity.ok(UsuarioMapper.toDTO(actualizado));
	}

	/**
	 * Sube la foto de perfil del usuario autenticado.
	 * Acepta multipart/form-data con campo "foto".
	 * Guarda el archivo en el directorio de uploads y actualiza fotoUrl en BD.
	 */
	@PreAuthorize("isAuthenticated()")
	@PostMapping(value = "/me/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, String>> subirFoto(@RequestParam("foto") MultipartFile foto) throws IOException {
		if (foto.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
		}

		String contentType = foto.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten imágenes"));
		}

		String extension = obtenerExtension(foto.getOriginalFilename());
		String nombreArchivo = UUID.randomUUID() + extension;

		Path directorio = Paths.get(uploadDir, "fotos");
		Files.createDirectories(directorio);
		Files.copy(foto.getInputStream(), directorio.resolve(nombreArchivo), StandardCopyOption.REPLACE_EXISTING);

		String fotoUrl = "/uploads/fotos/" + nombreArchivo;

		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		usuarioService.actualizarFoto(usuario.getId(), fotoUrl);

		return ResponseEntity.ok(Map.of("fotoUrl", fotoUrl));
	}

	private String obtenerExtension(String nombre) {
		if (nombre == null || !nombre.contains(".")) return ".jpg";
		return nombre.substring(nombre.lastIndexOf(".")).toLowerCase();
	}

	/**
	 * Obtiene todos los usuarios registrados en el sistema. Solo accesible por
	 * usuarios con rol ADMIN.
	 *
	 * @return lista de usuarios en formato DTO
	 */
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {

		List<Usuario> usuarios = usuarioService.listarUsuarios();
		List<UsuarioDTO> dtos = usuarios.stream().map(UsuarioMapper::toDTO).toList();

		return ResponseEntity.ok(dtos);
	}

	/**
	 * Obtiene un usuario por su identificador. Solo el propio usuario o un ADMIN
	 * pueden acceder.
	 *
	 * @param id identificador del usuario
	 * @return usuario encontrado en formato DTO
	 */
	@PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {

		Usuario usuario = usuarioService.obtenerPorId(id);
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuario));
	}

	/**
	 * Crea un nuevo usuario con rol CLIENTE. Endpoint público sin autenticación.
	 *
	 * @param dto datos necesarios para crear el usuario
	 * @return usuario creado en formato DTO
	 */
	@PostMapping("/cliente")
	public ResponseEntity<UsuarioDTO> crearCliente(@Valid @RequestBody UsuarioCreateDTO dto) {

		Usuario nuevo = usuarioService.crearCliente(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toDTO(nuevo));
	}

	/**
	 * Crea un nuevo usuario con rol PROFESIONAL. Endpoint público sin
	 * autenticación.
	 *
	 * @param dto datos necesarios para crear el usuario
	 * @return usuario creado en formato DTO
	 */
	@PostMapping("/profesional")
	public ResponseEntity<UsuarioDTO> crearProfesional(@Valid @RequestBody UsuarioCreateDTO dto) {

		Usuario nuevo = usuarioService.crearProfesional(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toDTO(nuevo));
	}

	/**
	 * Actualiza parcialmente los datos de un usuario existente. Solo el propio
	 * usuario o un ADMIN pueden modificarlo.
	 *
	 * @param id  identificador del usuario
	 * @param dto datos a actualizar
	 * @return usuario actualizado en formato DTO
	 */
	@PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
	@PatchMapping("/{id}")
	public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id,
			@Valid @RequestBody UsuarioUpdateDTO dto) {

		Usuario actualizado = usuarioService.actualizarUsuarioDesdeDTO(id, dto);
		return ResponseEntity.ok(UsuarioMapper.toDTO(actualizado));
	}

	/**
	 * Elimina un usuario del sistema. Solo accesible por usuarios con rol ADMIN.
	 *
	 * @param id identificador del usuario a eliminar
	 * @return respuesta sin contenido (204 No Content)
	 */
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {

		usuarioService.eliminarUsuario(id);
		return ResponseEntity.noContent().build();
	}
}
