package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.MenuRequest;
import com.restaurant.digital.model.entity.Menu;
import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.repository.MenuRepository;
import com.restaurant.digital.repository.PlatRepository;
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
    public ResponseEntity<Menu> modifierMenu(@PathVariable Integer id, @RequestBody MenuRequest request) {
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
    public ResponseEntity<Void> supprimerMenu(@PathVariable Integer id) {
        menuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> ajouterPlatAuMenu(@PathVariable Integer menuId, @PathVariable Integer platId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow();
        Plat plat = platRepository.findById(platId).orElseThrow();
        menu.getPlats().add(plat);
        return ResponseEntity.ok(menuRepository.save(menu));
    }
    
    @DeleteMapping("/{menuId}/plats/{platId}")
    public ResponseEntity<Menu> retirerPlatDuMenu(@PathVariable Integer menuId, @PathVariable Integer platId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow();
        menu.getPlats().removeIf(p -> p.getIdPlat().equals(platId));
        return ResponseEntity.ok(menuRepository.save(menu));
    }
}