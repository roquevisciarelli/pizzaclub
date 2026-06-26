package com.example.PizzaClub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductoDTO {
    private Integer id;

    @NotBlank(message = "El nombre del producto no puede estar vacío.")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio no puede ser nulo.")
    @Positive(message = "El precio debe ser un número positivo.")
    private Double precio;

    private String imagenUrl;

    @NotNull(message = "El ID de la categoría no puede ser nulo.")
    private Integer categoriaId;
    
    private String categoriaNombre;

    private Boolean disponible;
}