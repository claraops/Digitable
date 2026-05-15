package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.PlatRequest;
import com.restaurant.digital.model.entity.Ingredient;
import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.model.enums.CategoriePlat;
import com.restaurant.digital.repository.IngredientRepository;
import com.restaurant.digital.repository.PlatRepository;
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
    public ResponseEntity<Plat> modifierPlat(@PathVariable Integer id, @RequestBody PlatRequest request) {
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
    public ResponseEntity<Void> supprimerPlat(@PathVariable Integer id) {
        platRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/disponibilite")
    public ResponseEntity<Plat> toggleDisponibilite(@PathVariable Integer id) {
        return platRepository.findById(id).map(plat -> {
            plat.setDisponibilite(!plat.getDisponibilite());
            return ResponseEntity.ok(platRepository.save(plat));
        }).orElse(ResponseEntity.notFound().build());
    }
}