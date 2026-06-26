package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.ProductoDTO;
import com.example.PizzaClub.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
            @Valid @RequestPart("producto") ProductoDTO productoDTO,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        return new ResponseEntity<>(productoService.create(productoDTO, imagen), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> updateProducto(
            @PathVariable Integer id,
            @Valid @RequestPart("producto") ProductoDTO productoDTO,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        return ResponseEntity.ok(productoService.update(id, productoDTO, imagen));
    }
}