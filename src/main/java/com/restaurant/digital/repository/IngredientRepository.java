package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    
    // Vous pouvez ajouter des méthodes personnalisées ici si besoin
    Optional<Ingredient> findByNomIngredient(String nomIngredient);
}