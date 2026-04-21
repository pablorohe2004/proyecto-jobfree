package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.dto.profesional.ProfesionalDTO;
import com.jobfree.mapper.ProfesionalMapper;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.service.ProfesionalInfoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profesionales")
public class ProfesionalInfoController {

    private final ProfesionalInfoService profesionalInfoService;

    public ProfesionalInfoController(ProfesionalInfoService profesionalInfoService) {
        this.profesionalInfoService = profesionalInfoService;
    }

    /**
     * Obtiene todos los perfiles profesionales.
     *
     * @return lista de perfiles profesionales en formato DTO
     */
    @GetMapping
    public ResponseEntity<List<ProfesionalDTO>> listarProfesionales() {

        List<ProfesionalDTO> dtos = profesionalInfoService.listarPerfiles()
                .stream()
                .map(ProfesionalMapper::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * Obtiene un perfil por ID.
     *
     * @param id identificador del perfil
     * @return perfil profesional en formato DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> obtenerPorId(@PathVariable Long id) {

        ProfesionalInfo p = profesionalInfoService.obtenerPorId(id);
        return ResponseEntity.ok(ProfesionalMapper.toDTO(p));
    }

    /**
     * Obtiene el perfil profesional del usuario autenticado.
     *
     * @return perfil profesional del usuario autenticado en formato DTO
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mio")
    public ResponseEntity<ProfesionalDTO> obtenerMiPerfil() {

        Usuario usuario = (Usuario) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        ProfesionalInfo p = profesionalInfoService.obtenerPorUsuario(usuario.getId());

        return ResponseEntity.ok(ProfesionalMapper.toDTO(p));
    }

    /**
     * Crea un perfil profesional para el usuario autenticado.
     *
     * @param dto datos necesarios para crear el perfil
     * @return perfil profesional creado en formato DTO
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ProfesionalDTO> crearPerfil(
            @Valid @RequestBody ProfesionalCreateDTO dto) {

        Usuario usuario = (Usuario) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        ProfesionalInfo nuevo = profesionalInfoService.guardarPerfil(
                ProfesionalMapper.toEntity(dto, usuario)
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProfesionalMapper.toDTO(nuevo));
    }

    /**
     * Actualiza el perfil profesional del usuario autenticado.
     *
     * @param id  identificador del perfil a actualizar
     * @param dto datos actualizados del perfil
     * @return perfil profesional actualizado en formato DTO
     */
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> actualizarPerfil(
            @PathVariable Long id,
            @Valid @RequestBody ProfesionalCreateDTO dto) {

        Usuario usuario = (Usuario) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        ProfesionalInfo actualizado = profesionalInfoService.actualizarPerfil(id, dto, usuario);

        return ResponseEntity.ok(ProfesionalMapper.toDTO(actualizado));
    }

    /**
     * Elimina un perfil profesional.
     * Solo los usuarios con rol ADMIN pueden realizar esta operación.
     *
     * @param id identificador del perfil
     * @return respuesta sin contenido (204 No Content)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable Long id) {

        profesionalInfoService.eliminarPerfil(id);
        return ResponseEntity.noContent().build();
    }
}
