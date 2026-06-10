package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.AvisRequest;  // ← IMPORTANT
import com.restaurant.digital.model.entity.Avis;
import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.repository.AvisRepository;
import com.restaurant.digital.repository.CommandeRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisRepository avisRepository;
    private final CommandeRepository commandeRepository;  // ← Ajoutez ceci

    @GetMapping
    public ResponseEntity<List<Avis>> getAllAvis() {
        return ResponseEntity.ok(avisRepository.findAll());
    }
    
    @PostMapping
    public ResponseEntity<Avis> createAvis(@RequestBody AvisRequest request) {
        Avis avis = new Avis();
        
        Commande commande = commandeRepository.findById(request.getCommandeId())
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        avis.setCommande(commande);
        avis.setNote(request.getNote());
        avis.setCommentaire(request.getCommentaire());
        avis.setDateAvis(LocalDateTime.now());
        
        return ResponseEntity.ok(avisRepository.save(avis));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Avis> getAvisById(@PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvis(@PathVariable Integer id) {
        avisRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/plat/{platId}")
    public ResponseEntity<List<Avis>> getAvisByPlat(@PathVariable Integer platId) {
        return ResponseEntity.ok(avisRepository.findByPlatId(platId));
    }
}