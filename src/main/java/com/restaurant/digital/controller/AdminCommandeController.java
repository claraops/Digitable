package com.restaurant.digital.controller;

import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.service.interfaces.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/commandes")
@RequiredArgsConstructor
public class AdminCommandeController {

    private final CommandeService commandeService;

    // ✅ Mettre cette méthode EN PREMIER (sans path variable)
    @GetMapping
    @Operation(summary = "Récupérer toutes les commandes", description = "Retourne la liste de toutes les commandes")
    @ApiResponse(responseCode = "200", description = "Liste des commandes récupérée avec succès")
    public ResponseEntity<List<CommandeResponse>> getAllCommandes() {
        return ResponseEntity.ok(commandeService.getAllCommandes());
    }

    // ✅ Ensuite la méthode avec path variable
    @GetMapping("/statut/{statut}")
    @Operation(summary = "Récupérer les commandes par statut", description = "Retourne les commandes filtrées par leur statut")
    @ApiResponse(responseCode = "200", description = "Liste des commandes par statut récupérée avec succès")
    public ResponseEntity<List<CommandeResponse>> getCommandesByStatut(@Parameter(description = "Statut de la commande") @PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.getAllCommandesByStatut(statut));
    }
}