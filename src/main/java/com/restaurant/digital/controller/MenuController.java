package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Menu;
import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.repository.MenuRepository;
import com.restaurant.digital.repository.PlatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
public class MenuController {
    
    private final MenuRepository menuRepository;
    private final PlatRepository platRepository;
    
 // ✅ AJOUTER CETTE MÉTHODE
    @Operation(summary = "Récupérer tous les menus", description = "Retourne la liste complète des menus")
    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(menuRepository.findAll());
    }
  
   
    @Operation(summary = "Récupérer les menus actifs", description = "Retourne la liste des menus actifs")
    @GetMapping("/actifs")
    public ResponseEntity<List<Menu>> getMenusActifs() {
        return ResponseEntity.ok(menuRepository.findByActifTrue());
    }
    
    @Operation(summary = "Créer un menu", description = "Ajoute un nouveau menu")
    @ApiResponse(responseCode = "201", description = "Menu créé")
    @PostMapping
    public ResponseEntity<Menu> creerMenu(@RequestBody Menu menu) {
        menu.setDateCreation(LocalDateTime.now());
        menu.setActif(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(menuRepository.save(menu));
    }
    
    // ✅ CORRIGÉ : Utiliser Integer au lieu de String
    @Operation(summary = "Ajouter un plat au menu", description = "Associe un plat à un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat ajouté au menu"),
        @ApiResponse(responseCode = "404", description = "Menu ou plat non trouvé")
    })
    @PostMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> ajouterPlatAuMenu(
            @PathVariable @Parameter(description = "ID du menu") Integer menuId,  // ✅ CORRIGÉ : Integer
            @PathVariable @Parameter(description = "ID du plat") Integer platId) { // ✅ CORRIGÉ : Integer
        
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé avec l'id: " + menuId));
        
        Plat plat = platRepository.findById(platId)
            .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + platId));
        
        menu.getPlats().add(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ CORRIGÉ : Utiliser Integer
    @Operation(summary = "Récupérer les plats d'un menu", description = "Retourne la liste des plats associés à un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Liste des plats du menu"),
        @ApiResponse(responseCode = "404", description = "Menu non trouvé")
    })
    @GetMapping("/{id}/plats")
    public ResponseEntity<List<Plat>> getPlatsDuMenu(@PathVariable @Parameter(description = "ID du menu") Integer id) { // ✅ CORRIGÉ : Integer
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé avec l'id: " + id));
        return ResponseEntity.ok(menu.getPlats());
    }
    
    // ✅ Méthode supplémentaire : supprimer un plat d'un menu
    @Operation(summary = "Retirer un plat du menu", description = "Supprime l'association d'un plat à un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat retiré du menu"),
        @ApiResponse(responseCode = "404", description = "Menu ou plat non trouvé")
    })
    @DeleteMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> retirerPlatDuMenu(
            @PathVariable @Parameter(description = "ID du menu") Integer menuId,
            @PathVariable @Parameter(description = "ID du plat") Integer platId) {
        
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        Plat plat = platRepository.findById(platId)
            .orElseThrow(() -> new RuntimeException("Plat non trouvé"));
        
        menu.getPlats().remove(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ Méthode supplémentaire : mettre à jour un menu
    @Operation(summary = "Mettre à jour un menu", description = "Met à jour les informations d'un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Menu mis à jour"),
        @ApiResponse(responseCode = "404", description = "Menu non trouvé")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable @Parameter(description = "ID du menu") Integer id, @RequestBody Menu menuDetails) {
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        menu.setNomMenu(menuDetails.getNomMenu());
        menu.setActif(menuDetails.getActif());
        menu.setPrixSpecial(menuDetails.getPrixSpecial());
        
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ Méthode supplémentaire : supprimer un menu
    @Operation(summary = "Supprimer un menu", description = "Supprime un menu par son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Menu supprimé"),
        @ApiResponse(responseCode = "404", description = "Menu non trouvé")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable @Parameter(description = "ID du menu") Integer id) {
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        menuRepository.delete(menu);
        return ResponseEntity.noContent().build();
    }
}