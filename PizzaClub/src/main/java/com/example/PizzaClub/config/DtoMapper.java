package com.example.PizzaClub.config;

import com.example.PizzaClub.dto.CategoriaDTO;
import com.example.PizzaClub.dto.ProductoDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.entity.Producto;

public class DtoMapper {

    public static CategoriaDTO toCategoriaDTO(Categoria categoria) {
        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .activo(categoria.getActivo())
                .build();
    }

    public static ProductoDTO toProductoDTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .imagenUrl(producto.getImagenUrl())
                .categoriaId(producto.getCategoria().getId())
                .categoriaNombre(producto.getCategoria().getNombre())
                .disponible(producto.getDisponible())
                .build();
    }
}