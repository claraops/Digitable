package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.AvisRequest;  // ← IMPORTANT
import com.restaurant.digital.model.entity.Avis;
import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.repository.AvisRepository;
import com.restaurant.digital.repository.CommandeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "Récupérer tous les avis", description = "Retourne la liste de tous les avis")
    @ApiResponse(responseCode = "200", description = "Liste des avis récupérée avec succès")
    public ResponseEntity<List<Avis>> getAllAvis() {
        return ResponseEntity.ok(avisRepository.findAll());
    }
    
    @PostMapping
    @Operation(summary = "Créer un avis", description = "Crée un nouvel avis pour une commande")
    @ApiResponse(responseCode = "201", description = "Avis créé avec succès")
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
    @Operation(summary = "Récupérer un avis par ID", description = "Retourne les détails d'un avis spécifique")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Avis trouvé"),
        @ApiResponse(responseCode = "404", description = "Avis non trouvé")
    })
    public ResponseEntity<Avis> getAvisById(@Parameter(description = "ID de l'avis") @PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un avis", description = "Supprime un avis par son ID")
    @ApiResponse(responseCode = "204", description = "Avis supprimé avec succès")
    public ResponseEntity<Void> deleteAvis(@Parameter(description = "ID de l'avis") @PathVariable Integer id) {
        avisRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/plat/{platId}")
    @Operation(summary = "Récupérer les avis d'un plat", description = "Retourne tous les avis associés à un plat")
    @ApiResponse(responseCode = "200", description = "Liste des avis du plat récupérée avec succès")
    public ResponseEntity<List<Avis>> getAvisByPlat(@Parameter(description = "ID du plat") @PathVariable Integer platId) {
        return ResponseEntity.ok(avisRepository.findByPlatId(platId));
    }
}