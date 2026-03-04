package com.jobfree.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.service.ProfesionalInfoService;

@CrossOrigin
@RestController
@RequestMapping("/profesionales")
public class ProfesionalInfoController {

	private final ProfesionalInfoService profesionalInfoService;

	public ProfesionalInfoController(ProfesionalInfoService profesionalInfoService) {
		this.profesionalInfoService = profesionalInfoService;
	}
	
    // Devuelve todos los perfiles profesionales
    @GetMapping
    public ResponseEntity<List<ProfesionalInfo>> listarProfesionales() {
        return ResponseEntity.ok(profesionalInfoService.listarPerfiles());
    }

    // Crea un perfil profesional
    @PostMapping
    public ResponseEntity<ProfesionalInfo> crearPerfil(@RequestBody ProfesionalInfo perfil) {
        ProfesionalInfo nuevo = profesionalInfoService.guardarPerfil(perfil);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }	
}
