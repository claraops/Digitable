package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.PlatRequest;
import com.restaurant.digital.model.entity.Ingredient;
import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.model.enums.CategoriePlat;
import com.restaurant.digital.repository.IngredientRepository;
import com.restaurant.digital.repository.PlatRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/plats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlatController {
    
    private final PlatRepository platRepository;
    private final IngredientRepository ingredientRepository;
    
    @PostMapping
    @Operation(summary = "Ajouter un plat", description = "Crée un nouveau plat avec ses ingrédients")
    @ApiResponse(responseCode = "201", description = "Plat créé avec succès")
    public ResponseEntity<Plat> ajouterPlat(@RequestBody PlatRequest request) {
        Plat plat = new Plat();
        plat.setNomPlat(request.getNomPlat());
        plat.setDescription(request.getDescription());
        plat.setPrix(request.getPrix());
        plat.setDisponibilite(request.getDisponibilite() != null ? request.getDisponibilite() : true);
        plat.setImagePlat(request.getImagePlat());
        
     // Dans ajouterPlat()
        if (request.getCategorie() != null) {
            plat.setCategorie(CategoriePlat.valueOf(request.getCategorie()));
        } else {
            plat.setCategorie(CategoriePlat.PLAT_PRINCIPAL); // valeur par défaut
        }
        
        if (request.getIngredientIds() != null) {
            List<Ingredient> ingredients = ingredientRepository.findAllById(request.getIngredientIds());
            plat.setIngredients(ingredients);
        }
        
        return new ResponseEntity<>(platRepository.save(plat), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un plat", description = "Met à jour un plat existant par son ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat modifié avec succès"),
        @ApiResponse(responseCode = "404", description = "Plat non trouvé")
    })
    public ResponseEntity<Plat> modifierPlat(@Parameter(description = "ID du plat") @PathVariable Integer id, @RequestBody PlatRequest request) {
        return platRepository.findById(id).map(plat -> {
            plat.setNomPlat(request.getNomPlat());
            plat.setDescription(request.getDescription());
            plat.setPrix(request.getPrix());
            plat.setDisponibilite(request.getDisponibilite());
            plat.setImagePlat(request.getImagePlat());
            return ResponseEntity.ok(platRepository.save(plat));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un plat", description = "Supprime un plat par son ID")
    @ApiResponse(responseCode = "204", description = "Plat supprimé avec succès")
    public ResponseEntity<Void> supprimerPlat(@Parameter(description = "ID du plat") @PathVariable Integer id) {
        platRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/disponibilite")
    @Operation(summary = "Basculer la disponibilité d'un plat", description = "Inverse l'état de disponibilité d'un plat")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Disponibilité modifiée avec succès"),
        @ApiResponse(responseCode = "404", description = "Plat non trouvé")
    })
    public ResponseEntity<Plat> toggleDisponibilite(@Parameter(description = "ID du plat") @PathVariable Integer id) {
        return platRepository.findById(id).map(plat -> {
            plat.setDisponibilite(!plat.getDisponibilite());
            return ResponseEntity.ok(platRepository.save(plat));
        }).orElse(ResponseEntity.notFound().build());
    }
}