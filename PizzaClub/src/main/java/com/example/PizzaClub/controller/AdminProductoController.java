package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.ProductoDTO;
import com.example.PizzaClub.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/productos")
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getAllProductos() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> createProducto(
            @Valid @RequestBody ProductoDTO productoDTO) {
        return new ResponseEntity<>(productoService.create(productoDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> updateProducto(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoDTO productoDTO) {
        return ResponseEntity.ok(productoService.update(id, productoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}