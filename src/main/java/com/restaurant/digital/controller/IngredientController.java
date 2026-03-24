package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Ingredient;
import com.restaurant.digital.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IngredientController {

    private final IngredientRepository ingredientRepository;

    @PostMapping
    public ResponseEntity<Ingredient> creerIngredient(@RequestBody Ingredient ingredient) {
        return new ResponseEntity<>(ingredientRepository.save(ingredient), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(ingredientRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Integer id) {
        return ingredientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}