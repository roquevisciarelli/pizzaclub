package com.example.PizzaClub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;
    private Integer categoriaId;
    private String categoriaNombre;
}