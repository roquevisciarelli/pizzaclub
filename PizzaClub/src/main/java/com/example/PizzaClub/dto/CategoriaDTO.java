package com.example.PizzaClub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaDTO {
    private Integer id;

    @NotBlank(message = "El nombre de la categoría no puede estar vacío.")
    private String nombre;
    
    private Boolean activo;
}