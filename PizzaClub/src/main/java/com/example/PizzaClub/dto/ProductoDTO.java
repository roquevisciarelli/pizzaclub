package com.example.PizzaClub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Integer id;

    @NotBlank(message = "El nombre del producto no puede estar vacío.")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio no puede ser nulo.")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero.")
    private Double precio;

    @NotNull(message = "El ID de la categoría no puede ser nulo.")
    private Integer categoriaId;

    private String categoriaNombre;

    private Boolean disponible;
}