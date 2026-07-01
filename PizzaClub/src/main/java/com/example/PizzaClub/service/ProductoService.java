package com.example.PizzaClub.service;

import com.example.PizzaClub.config.DtoMapper;
import com.example.PizzaClub.dto.ProductoDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.entity.Producto;
import com.example.PizzaClub.repository.CategoriaRepository;
import com.example.PizzaClub.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<ProductoDTO> findAll() {
        return productoRepository.findAll().stream()
                .map(DtoMapper::toProductoDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoDTO findById(Integer id) {
        return productoRepository.findById(id)
                .map(DtoMapper::toProductoDTO)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
    }

    @Transactional
    public ProductoDTO create(ProductoDTO productoDTO) {
        validateProductoDTO(productoDTO);

        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + productoDTO.getCategoriaId()));

        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre().trim());
        producto.setDescripcion(productoDTO.getDescripcion() != null ? productoDTO.getDescripcion().trim() : null);
        producto.setPrecio(productoDTO.getPrecio());
        producto.setCategoria(categoria);
        producto.setDisponible(productoDTO.getDisponible() != null ? productoDTO.getDisponible() : true);

        Producto savedProducto = productoRepository.save(producto);
        return DtoMapper.toProductoDTO(savedProducto);
    }

    @Transactional
    public ProductoDTO update(Integer id, ProductoDTO productoDTO) {
        validateProductoDTO(productoDTO);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + productoDTO.getCategoriaId()));

        producto.setNombre(productoDTO.getNombre().trim());
        producto.setDescripcion(productoDTO.getDescripcion() != null ? productoDTO.getDescripcion().trim() : null);
        producto.setPrecio(productoDTO.getPrecio());
        producto.setCategoria(categoria);
        producto.setDisponible(productoDTO.getDisponible() != null ? productoDTO.getDisponible() : producto.getDisponible());

        Producto updatedProducto = productoRepository.save(producto);
        return DtoMapper.toProductoDTO(updatedProducto);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    private void validateProductoDTO(ProductoDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto no puede estar vacío.");
        }
        if (dto.getPrecio() == null || dto.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor que cero.");
        }
        if (dto.getCategoriaId() == null) {
            throw new IllegalArgumentException("El ID de la categoría no puede ser nulo.");
        }
    }
}