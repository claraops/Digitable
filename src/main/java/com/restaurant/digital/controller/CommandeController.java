package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.CommandeRequest;
import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.service.interfaces.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commandes")
@RequiredArgsConstructor
public class CommandeController {
    
    private final CommandeService commandeService;
    
    @PostMapping
    @Operation(summary = "Créer une commande", description = "Crée une nouvelle commande")
    @ApiResponse(responseCode = "201", description = "Commande créée avec succès")
    public ResponseEntity<CommandeResponse> creerCommande(@Valid @RequestBody CommandeRequest request) {
        CommandeResponse response = commandeService.creerCommande(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une commande par ID", description = "Retourne les détails d'une commande spécifique")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Commande trouvée"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeResponse> getCommandeById(@Parameter(description = "ID de la commande") @PathVariable Integer id) {
        CommandeResponse response = commandeService.getCommandeById(id);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/statut")
    @Operation(summary = "Modifier le statut d'une commande", description = "Met à jour le statut d'une commande")
    @ApiResponse(responseCode = "200", description = "Statut modifié avec succès")
    public ResponseEntity<CommandeResponse> modifierStatut(
            @Parameter(description = "ID de la commande") @PathVariable Integer id,
            @Parameter(description = "Nouveau statut de la commande") @RequestParam StatutCommande statut) {
        CommandeResponse response = commandeService.modifierStatut(id, statut);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/statut/{statut}")
    @Operation(summary = "Récupérer les commandes par statut", description = "Retourne les commandes filtrées par statut")
    @ApiResponse(responseCode = "200", description = "Liste des commandes par statut récupérée avec succès")
    public ResponseEntity<List<CommandeResponse>> getCommandesByStatut(@Parameter(description = "Statut de la commande") @PathVariable StatutCommande statut) {
        List<CommandeResponse> commandes = commandeService.getCommandesByStatut(statut);
        return ResponseEntity.ok(commandes);
    }
    
    @PostMapping("/{id}/annuler")
    @Operation(summary = "Annuler une commande", description = "Annule une commande par son ID")
    @ApiResponse(responseCode = "200", description = "Commande annulée avec succès")
    public ResponseEntity<?> annulerCommande(@Parameter(description = "ID de la commande") @PathVariable Integer id) {
        commandeService.annulerCommande(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/utilisateur/{userId}")
    @Operation(summary = "Récupérer l'historique des commandes d'un utilisateur", description = "Retourne toutes les commandes d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès")
    public ResponseEntity<List<CommandeResponse>> getHistoriqueUtilisateur(@Parameter(description = "ID de l'utilisateur") @PathVariable Integer userId) {
        List<CommandeResponse> historique = commandeService.getHistoriqueUtilisateur(userId);
        return ResponseEntity.ok(historique);
    }
}