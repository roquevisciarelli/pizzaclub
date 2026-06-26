package com.example.PizzaClub.controller;

import com.example.PizzaClub.config.DtoMapper;
import com.example.PizzaClub.dto.CategoriaDTO;
import com.example.PizzaClub.dto.CategoriaRequestDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/categorias")
@RequiredArgsConstructor
public class AdminCategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> getAllCategorias() {
        List<CategoriaDTO> categorias = categoriaRepository.findAll().stream()
                .map(DtoMapper::toCategoriaDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> createCategoria(@RequestBody CategoriaRequestDTO request) {
        Categoria categoria = Categoria.builder()
                .nombre(request.getNombre())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build();
        Categoria saved = categoriaRepository.save(categoria);
        return new ResponseEntity<>(DtoMapper.toCategoriaDTO(saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> updateCategoria(@PathVariable Integer id, @RequestBody CategoriaRequestDTO request) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(request.getNombre());
                    if (request.getActivo() != null) {
                        categoria.setActivo(request.getActivo());
                    }
                    Categoria updated = categoriaRepository.save(categoria);
                    return ResponseEntity.ok(DtoMapper.toCategoriaDTO(updated));
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
