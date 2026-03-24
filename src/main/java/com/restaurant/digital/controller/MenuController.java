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

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {
    
    private final MenuRepository menuRepository;
    private final PlatRepository platRepository;
    
    @GetMapping("/actifs")
    public ResponseEntity<List<Menu>> getMenusActifs() {
        return ResponseEntity.ok(menuRepository.findByActifTrue());
    }
    
    @PostMapping
    public ResponseEntity<Menu> creerMenu(@RequestBody Menu menu) {
        menu.setDateCreation(LocalDateTime.now());
        menu.setActif(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(menuRepository.save(menu));
    }
    
    // ✅ CORRIGÉ : Utiliser Integer au lieu de String
    @PostMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> ajouterPlatAuMenu(
            @PathVariable Integer menuId,  // ✅ CORRIGÉ : Integer
            @PathVariable Integer platId) { // ✅ CORRIGÉ : Integer
        
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé avec l'id: " + menuId));
        
        Plat plat = platRepository.findById(platId)
            .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + platId));
        
        menu.getPlats().add(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ CORRIGÉ : Utiliser Integer
    @GetMapping("/{id}/plats")
    public ResponseEntity<List<Plat>> getPlatsDuMenu(@PathVariable Integer id) { // ✅ CORRIGÉ : Integer
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé avec l'id: " + id));
        return ResponseEntity.ok(menu.getPlats());
    }
    
    // ✅ Méthode supplémentaire : supprimer un plat d'un menu
    @DeleteMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> retirerPlatDuMenu(
            @PathVariable Integer menuId,
            @PathVariable Integer platId) {
        
        Menu menu = menuRepository.findById(menuId)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        Plat plat = platRepository.findById(platId)
            .orElseThrow(() -> new RuntimeException("Plat non trouvé"));
        
        menu.getPlats().remove(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ Méthode supplémentaire : mettre à jour un menu
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Integer id, @RequestBody Menu menuDetails) {
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        menu.setNomMenu(menuDetails.getNomMenu());
        menu.setActif(menuDetails.getActif());
        menu.setPrixSpecial(menuDetails.getPrixSpecial());
        
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    // ✅ Méthode supplémentaire : supprimer un menu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Integer id) {
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu non trouvé"));
        
        menuRepository.delete(menu);
        return ResponseEntity.noContent().build();
    }
}