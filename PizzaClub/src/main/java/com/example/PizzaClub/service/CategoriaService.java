package com.example.PizzaClub.service;

import com.example.PizzaClub.config.DtoMapper;
import com.example.PizzaClub.dto.CategoriaDTO;
import com.example.PizzaClub.entity.Categoria;
import com.example.PizzaClub.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> findAll() {
        return categoriaRepository.findAll().stream()
                .map(DtoMapper::toCategoriaDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO findById(Integer id) {
        return categoriaRepository.findById(id)
                .map(DtoMapper::toCategoriaDTO)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
    }

    public CategoriaDTO create(CategoriaDTO categoriaDTO) {
        Categoria categoria = new Categoria();
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setActivo(categoriaDTO.getActivo() != null ? categoriaDTO.getActivo() : true);
        
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return DtoMapper.toCategoriaDTO(savedCategoria);
    }

    public CategoriaDTO update(Integer id, CategoriaDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
        
        categoria.setNombre(categoriaDTO.getNombre());
        if (categoriaDTO.getActivo() != null) {
            categoria.setActivo(categoriaDTO.getActivo());
        }

        Categoria updatedCategoria = categoriaRepository.save(categoria);
        return DtoMapper.toCategoriaDTO(updatedCategoria);
    }
}