package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.CommandeRequest;
import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.service.interfaces.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commandes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommandeController {
    
    private final CommandeService commandeService;
    
    @PostMapping
    public ResponseEntity<CommandeResponse> creerCommande(@Valid @RequestBody CommandeRequest request) {
        CommandeResponse response = commandeService.creerCommande(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponse> getCommandeById(@PathVariable Integer id) {
        CommandeResponse response = commandeService.getCommandeById(id);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/statut")
    public ResponseEntity<CommandeResponse> modifierStatut(
            @PathVariable Integer id,
            @RequestParam StatutCommande statut) {
        CommandeResponse response = commandeService.modifierStatut(id, statut);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CommandeResponse>> getCommandesByStatut(@PathVariable StatutCommande statut) {
        List<CommandeResponse> commandes = commandeService.getCommandesByStatut(statut);
        return ResponseEntity.ok(commandes);
    }
    
    @PostMapping("/{id}/annuler")
    public ResponseEntity<?> annulerCommande(@PathVariable Integer id) {
        commandeService.annulerCommande(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/utilisateur/{userId}")
    public ResponseEntity<List<CommandeResponse>> getHistoriqueUtilisateur(@PathVariable Integer userId) {
        List<CommandeResponse> historique = commandeService.getHistoriqueUtilisateur(userId);
        return ResponseEntity.ok(historique);
    }
}