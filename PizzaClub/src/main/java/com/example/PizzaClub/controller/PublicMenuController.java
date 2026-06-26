package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.CategoriaResponseDTO;
import com.example.PizzaClub.dto.ProductoResponseDTO;
import com.example.PizzaClub.repository.CategoriaRepository;
import com.example.PizzaClub.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/menu")
@RequiredArgsConstructor
public class PublicMenuController {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponseDTO>> getCategoriasActivas() {
        List<CategoriaResponseDTO> categorias = categoriaRepository.findByActivoTrue().stream()
                .map(cat -> CategoriaResponseDTO.builder()
                        .id(cat.getId())
                        .nombre(cat.getNombre())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponseDTO>> getProductosDisponibles() {
        List<ProductoResponseDTO> productos = productoRepository.findByDisponibleTrue().stream()
                .map(prod -> ProductoResponseDTO.builder()
                        .id(prod.getId())
                        .nombre(prod.getNombre())
                        .descripcion(prod.getDescripcion())
                        .precio(prod.getPrecio())
                        .categoriaId(prod.getCategoria().getId())
                        .categoriaNombre(prod.getCategoria().getNombre())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }
}