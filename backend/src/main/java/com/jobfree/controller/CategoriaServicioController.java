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

import com.jobfree.model.entity.CategoriaServicio;
import com.jobfree.service.CategoriaServicioService;

@CrossOrigin
@RestController
@RequestMapping("/categorias")
public class CategoriaServicioController {

	private final CategoriaServicioService categoriaServicioService;

	public CategoriaServicioController(CategoriaServicioService categoriaService) {
		this.categoriaServicioService = categoriaService;
	}
	
	
	/**
	 * Devuelve la lista de todas las categorías disponibles.
	 */
    @GetMapping
    public ResponseEntity<List<CategoriaServicio>> listarCategorias() {
        return ResponseEntity.ok(categoriaServicioService.listarCategorias());
    }
    
	/**
	 * Crea una nueva categoría de servicio en la base de datos.
	 */
    @PostMapping
    public ResponseEntity<CategoriaServicio> crearCategoria(@RequestBody CategoriaServicio categoria) {
        CategoriaServicio nueva = categoriaServicioService.guardarCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }
}
