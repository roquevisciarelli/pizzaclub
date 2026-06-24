package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.CategoriaRequestDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categorias")
@RequiredArgsConstructor
public class AdminCategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody CategoriaRequestDTO request) {
        Categoria categoria = Categoria.builder()
                .nombre(request.getNombre())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build();
        return new ResponseEntity<>(categoriaRepository.save(categoria), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Integer id, @RequestBody CategoriaRequestDTO request) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(request.getNombre());
                    if (request.getActivo() != null) {
                        categoria.setActivo(request.getActivo());
                    }
                    return ResponseEntity.ok(categoriaRepository.save(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Integer id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}