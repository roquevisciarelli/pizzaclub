package com.example.PizzaClub.service;

import com.example.PizzaClub.config.DtoMapper;
import com.example.PizzaClub.dto.ProductoDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.entity.Producto;
import com.example.PizzaClub.repository.CategoriaRepository;
import com.example.PizzaClub.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CloudinaryService cloudinaryService;

    public List<ProductoDTO> findAll() {
        return productoRepository.findAll().stream()
                .map(DtoMapper::toProductoDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO findById(Integer id) {
        return productoRepository.findById(id)
                .map(DtoMapper::toProductoDTO)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
    }

    public ProductoDTO create(ProductoDTO productoDTO, MultipartFile imagen) throws IOException {
        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + productoDTO.getCategoriaId()));

        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setCategoria(categoria);
        producto.setDisponible(productoDTO.getDisponible() != null ? productoDTO.getDisponible() : true);

        if (imagen != null && !imagen.isEmpty()) {
            String imagenUrl = cloudinaryService.uploadImage(imagen);
            producto.setImagenUrl(imagenUrl);
        }

        Producto savedProducto = productoRepository.save(producto);
        return DtoMapper.toProductoDTO(savedProducto);
    }

    public ProductoDTO update(Integer id, ProductoDTO productoDTO, MultipartFile imagen) throws IOException {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + productoDTO.getCategoriaId()));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setCategoria(categoria);
        if (productoDTO.getDisponible() != null) {
            producto.setDisponible(productoDTO.getDisponible());
        }

        if (imagen != null && !imagen.isEmpty()) {
            String imagenUrl = cloudinaryService.uploadImage(imagen);
            producto.setImagenUrl(imagenUrl);
        }

        Producto updatedProducto = productoRepository.save(producto);
        return DtoMapper.toProductoDTO(updatedProducto);
    }
}