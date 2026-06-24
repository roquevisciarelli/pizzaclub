package com.example.PizzaClub.repository;

import com.example.PizzaClub.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByDisponibleTrue();
    List<Producto> findByCategoriaId(Integer categoriaId);
}