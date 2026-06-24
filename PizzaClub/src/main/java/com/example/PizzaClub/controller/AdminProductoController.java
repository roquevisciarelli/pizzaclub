package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.ProductoRequestDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.entity.Producto;
import com.example.PizzaClub.repository.CategoriaRepository;
import com.example.PizzaClub.repository.ProductoRepository;
import com.example.PizzaClub.service.CloudinaryService;
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

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        return ResponseEntity.ok(productoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createProducto(
            @ModelAttribute ProductoRequestDTO request,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

            String imagenUrl = null;
            if (imagen != null && !imagen.isEmpty()) {
                imagenUrl = cloudinaryService.uploadImage(imagen);
            }

            Producto producto = Producto.builder()
                    .nombre(request.getNombre())
                    .descripcion(request.getDescripcion())
                    .precio(request.getPrecio())
                    .categoria(categoria)
                    .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                    .imagenUrl(imagenUrl)
                    .build();

            return new ResponseEntity<>(productoRepository.save(producto), HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(
            @PathVariable Integer id,
            @ModelAttribute ProductoRequestDTO request,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            return productoRepository.findById(id)
                    .map(producto -> {
                        try {
                            producto.setNombre(request.getNombre());
                            producto.setDescripcion(request.getDescripcion());
                            producto.setPrecio(request.getPrecio());
                            if (request.getDisponible() != null) {
                                producto.setDisponible(request.getDisponible());
                            }

                            if (request.getCategoriaId() != null) {
                                Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                                producto.setCategoria(categoria);
                            }

                            if (imagen != null && !imagen.isEmpty()) {
                                String imagenUrl = cloudinaryService.uploadImage(imagen);
                                producto.setImagenUrl(imagenUrl);
                            }

                            return ResponseEntity.ok(productoRepository.save(producto));
                        } catch (IOException e) {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
                        } catch (RuntimeException e) {
                            return ResponseEntity.badRequest().body(e.getMessage());
                        }
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}