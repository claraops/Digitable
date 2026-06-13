package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Ingredient;
import com.restaurant.digital.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientRepository ingredientRepository;

    @Operation(summary = "Créer un ingrédient", description = "Ajoute un nouvel ingrédient")
    @ApiResponse(responseCode = "201", description = "Ingrédient créé")
    @PostMapping
    public ResponseEntity<Ingredient> creerIngredient(@RequestBody Ingredient ingredient) {
        return new ResponseEntity<>(ingredientRepository.save(ingredient), HttpStatus.CREATED);
    }

    @Operation(summary = "Récupérer tous les ingrédients", description = "Retourne la liste complète des ingrédients")
    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(ingredientRepository.findAll());
    }

    @Operation(summary = "Récupérer un ingrédient par ID", description = "Retourne un ingrédient selon son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Ingrédient trouvé"),
        @ApiResponse(responseCode = "404", description = "Ingrédient non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable @Parameter(description = "ID de l'ingrédient") Integer id) {
        return ingredientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}