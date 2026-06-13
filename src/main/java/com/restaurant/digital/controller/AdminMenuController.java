package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.MenuRequest;
import com.restaurant.digital.model.entity.Menu;
import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.repository.MenuRepository;
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
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/menus")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMenuController {
    
    private final MenuRepository menuRepository;
    private final PlatRepository platRepository;
    
    @PostMapping
    @Operation(summary = "Ajouter un menu", description = "Crée un nouveau menu avec les plats associés")
    @ApiResponse(responseCode = "201", description = "Menu créé avec succès")
    public ResponseEntity<Menu> ajouterMenu(@RequestBody MenuRequest request) {
        Menu menu = new Menu();
        menu.setNomMenu(request.getNomMenu());
        menu.setDescriptionMenu(request.getDescriptionMenu());
        menu.setPhoto(request.getPhoto());
        menu.setActif(request.getActif() != null ? request.getActif() : true);
        menu.setPrixSpecial(request.getPrixSpecial());
        menu.setDateCreation(LocalDateTime.now());
        
        if (request.getPlatIds() != null) {
            List<Plat> plats = platRepository.findAllById(request.getPlatIds());
            menu.setPlats(plats);
        }
        
        return new ResponseEntity<>(menuRepository.save(menu), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un menu", description = "Met à jour un menu existant par son ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Menu modifié avec succès"),
        @ApiResponse(responseCode = "404", description = "Menu non trouvé")
    })
    public ResponseEntity<Menu> modifierMenu(@Parameter(description = "ID du menu") @PathVariable Integer id, @RequestBody MenuRequest request) {
        return menuRepository.findById(id).map(menu -> {
            menu.setNomMenu(request.getNomMenu());
            menu.setDescriptionMenu(request.getDescriptionMenu());
            menu.setPhoto(request.getPhoto());
            menu.setActif(request.getActif());
            menu.setPrixSpecial(request.getPrixSpecial());
            return ResponseEntity.ok(menuRepository.save(menu));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un menu", description = "Supprime un menu par son ID")
    @ApiResponse(responseCode = "204", description = "Menu supprimé avec succès")
    public ResponseEntity<Void> supprimerMenu(@Parameter(description = "ID du menu") @PathVariable Integer id) {
        menuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{menuId}/plats/{platId}")
    @Operation(summary = "Ajouter un plat à un menu", description = "Associe un plat existant à un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat ajouté au menu avec succès"),
        @ApiResponse(responseCode = "404", description = "Menu ou plat non trouvé")
    })
    public ResponseEntity<Menu> ajouterPlatAuMenu(@Parameter(description = "ID du menu") @PathVariable Integer menuId, @Parameter(description = "ID du plat") @PathVariable Integer platId) {
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé avec l'id: " + menuId));
        Plat plat = platRepository.findById(platId)
            .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + platId));
        menu.getPlats().add(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }

    @DeleteMapping("/{menuId}/plats/{platId}")
    @Operation(summary = "Retirer un plat d'un menu", description = "Dissocie un plat d'un menu")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat retiré du menu avec succès"),
        @ApiResponse(responseCode = "404", description = "Menu non trouvé")
    })
    public ResponseEntity<Menu> retirerPlatDuMenu(@Parameter(description = "ID du menu") @PathVariable Integer menuId, @Parameter(description = "ID du plat") @PathVariable Integer platId) {
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        menu.getPlats().removeIf(p -> p.getIdPlat().equals(platId));
        return ResponseEntity.ok(menuRepository.save(menu));
    }
}