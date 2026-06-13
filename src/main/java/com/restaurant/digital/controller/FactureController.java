package com.restaurant.digital.controller;

import com.restaurant.digital.dto.response.RapportJournalier;
import com.restaurant.digital.model.entity.Facture;
import com.restaurant.digital.repository.FactureRepository;
import com.restaurant.digital.service.interfaces.FactureService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/factures")
@RequiredArgsConstructor
public class FactureController {

    private final FactureRepository factureRepository;
    private final FactureService factureService;

    /**
     * Créer une nouvelle facture pour une commande
     * POST /api/v1/factures
     */
    @Operation(summary = "Créer une nouvelle facture", description = "Crée une facture pour une commande avec le mode de paiement spécifié")
    @ApiResponse(responseCode = "201", description = "Facture créée")
    @PostMapping
    public ResponseEntity<Facture> creerFacture(@RequestBody Map<String, Object> payload) {
        Integer idCommande = (Integer) payload.get("idCommande");
        String modePaiement = (String) payload.get("modePaiement");
        
        Facture facture = factureService.creerFacture(idCommande, modePaiement);
        return new ResponseEntity<>(facture, HttpStatus.CREATED);
    }

    /**
     * Récupérer toutes les factures
     * GET /api/v1/factures
     */
    @Operation(summary = "Récupérer toutes les factures", description = "Retourne la liste complète des factures")
    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures() {
        List<Facture> factures = factureRepository.findAll();
        return ResponseEntity.ok(factures);
    }

    /**
     * Récupérer une facture par son ID
     * GET /api/v1/factures/{id}
     */
    @Operation(summary = "Récupérer une facture par ID", description = "Retourne une facture selon son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Facture trouvée"),
        @ApiResponse(responseCode = "404", description = "Facture non trouvée")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable @Parameter(description = "ID de la facture") Integer id) {
        return factureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer la facture d'une commande
     * GET /api/v1/factures/commande/{commandeId}
     */
    @Operation(summary = "Récupérer la facture d'une commande", description = "Retourne la facture associée à une commande")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Facture trouvée"),
        @ApiResponse(responseCode = "404", description = "Facture non trouvée")
    })
    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<Facture> getFactureByCommande(@PathVariable @Parameter(description = "ID de la commande") Integer commandeId) {
        return factureRepository.findByCommandeIdCommande(commandeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer les factures par mode de paiement
     * GET /api/v1/factures/paiement/{mode}
     */
    @Operation(summary = "Récupérer les factures par mode de paiement", description = "Retourne les factures filtrées par mode de paiement")
    @GetMapping("/paiement/{mode}")
    public ResponseEntity<List<Facture>> getFacturesByModePaiement(@PathVariable @Parameter(description = "Mode de paiement") String mode) {
        List<Facture> factures = factureRepository.findByModePaiement(mode);
        return ResponseEntity.ok(factures);
    }

    /**
     * Récupérer les factures entre deux dates
     * GET /api/v1/factures/periode?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @Operation(summary = "Récupérer les factures par période", description = "Retourne les factures entre deux dates")
    @GetMapping("/periode")
    public ResponseEntity<List<Facture>> getFacturesByPeriode(
            @RequestParam @Parameter(description = "Date de début (format ISO)") String debut,
            @RequestParam @Parameter(description = "Date de fin (format ISO)") String fin) {
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateDebut = LocalDateTime.parse(debut, formatter);
        LocalDateTime dateFin = LocalDateTime.parse(fin, formatter);
        
        List<Facture> factures = factureRepository.findByDatePaiementBetween(dateDebut, dateFin);
        return ResponseEntity.ok(factures);
    }

    /**
     * Rapport journalier
     * GET /api/v1/factures/rapport/journalier
     */
    @Operation(summary = "Rapport journalier", description = "Retourne le rapport des ventes du jour")
    @GetMapping("/rapport/journalier")
    public ResponseEntity<RapportJournalier> getRapportJournalier() {
        RapportJournalier rapport = factureService.getRapportDuJour();
        return ResponseEntity.ok(rapport);
    }

    /**
     * Chiffre d'affaires total
     * GET /api/v1/factures/stats/ca-total
     */
    @Operation(summary = "Chiffre d'affaires total", description = "Retourne le chiffre d'affaires total")
    @GetMapping("/stats/ca-total")
    public ResponseEntity<Map<String, BigDecimal>> getChiffreAffairesTotal() {
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("chiffreAffairesTotal", factureRepository.chiffreAffairesTotal());
        return ResponseEntity.ok(response);
    }

    /**
     * Chiffre d'affaires par période
     * GET /api/v1/factures/stats/ca-periode?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @Operation(summary = "Chiffre d'affaires par période", description = "Retourne le chiffre d'affaires entre deux dates")
    @GetMapping("/stats/ca-periode")
    public ResponseEntity<Map<String, BigDecimal>> getChiffreAffairesParPeriode(
            @RequestParam @Parameter(description = "Date de début (format ISO)") String debut,
            @RequestParam @Parameter(description = "Date de fin (format ISO)") String fin) {
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateDebut = LocalDateTime.parse(debut, formatter);
        LocalDateTime dateFin = LocalDateTime.parse(fin, formatter);
        
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("chiffreAffaires", factureRepository.chiffreAffairesParPeriode(dateDebut, dateFin));
        return ResponseEntity.ok(response);
    }

    /**
     * Ticket moyen par période
     * GET /api/v1/factures/stats/ticket-moyen?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @Operation(summary = "Ticket moyen par période", description = "Retourne le ticket moyen entre deux dates")
    @GetMapping("/stats/ticket-moyen")
    public ResponseEntity<Map<String, BigDecimal>> getTicketMoyenParPeriode(
            @RequestParam @Parameter(description = "Date de début (format ISO)") String debut,
            @RequestParam @Parameter(description = "Date de fin (format ISO)") String fin) {
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateDebut = LocalDateTime.parse(debut, formatter);
        LocalDateTime dateFin = LocalDateTime.parse(fin, formatter);
        
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("ticketMoyen", factureRepository.ticketMoyenParPeriode(dateDebut, dateFin));
        return ResponseEntity.ok(response);
    }

    /**
     * Statistiques par mode de paiement
     * GET /api/v1/factures/stats/par-mode
     */
    @Operation(summary = "Statistiques par mode de paiement", description = "Retourne les statistiques groupées par mode de paiement")
    @GetMapping("/stats/par-mode")
    public ResponseEntity<List<Object[]>> getStatistiquesParModePaiement() {
        return ResponseEntity.ok(factureRepository.statistiquesParModePaiement());
    }

    /**
     * Statistiques mensuelles
     * GET /api/v1/factures/stats/mensuelles
     */
    @Operation(summary = "Statistiques mensuelles", description = "Retourne les statistiques mensuelles")
    @GetMapping("/stats/mensuelles")
    public ResponseEntity<List<Object[]>> getStatistiquesMensuelles() {
        return ResponseEntity.ok(factureRepository.getStatistiquesMensuelles());
    }

    /**
     * Factures du jour
     * GET /api/v1/factures/jour
     */
    @Operation(summary = "Factures du jour", description = "Retourne les factures créées aujourd'hui")
    @GetMapping("/jour")
    public ResponseEntity<List<Facture>> getFacturesDuJour() {
        return ResponseEntity.ok(factureRepository.facturesDuJour());
    }

    /**
     * Factures de la semaine
     * GET /api/v1/factures/semaine
     */
    @Operation(summary = "Factures de la semaine", description = "Retourne les factures de la semaine")
    @GetMapping("/semaine")
    public ResponseEntity<List<Facture>> getFacturesDeLaSemaine() {
        return ResponseEntity.ok(factureRepository.facturesDeLaSemaine());
    }

    /**
     * Factures du mois
     * GET /api/v1/factures/mois
     */
    @Operation(summary = "Factures du mois", description = "Retourne les factures du mois")
    @GetMapping("/mois")
    public ResponseEntity<List<Facture>> getFacturesDuMois() {
        return ResponseEntity.ok(factureRepository.facturesDuMois());
    }

    /**
     * Vérifier si une commande a une facture
     * GET /api/v1/factures/commande/{commandeId}/existe
     */
    @Operation(summary = "Vérifier l'existence d'une facture", description = "Vérifie si une commande possède une facture")
    @GetMapping("/commande/{commandeId}/existe")
    public ResponseEntity<Map<String, Boolean>> existeFacturePourCommande(@PathVariable @Parameter(description = "ID de la commande") Integer commandeId) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("existe", factureRepository.existsByCommandeIdCommande(commandeId));
        return ResponseEntity.ok(response);
    }

    /**
     * Supprimer une facture
     * DELETE /api/v1/factures/{id}
     */
    @Operation(summary = "Supprimer une facture", description = "Supprime une facture par son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Facture supprimée"),
        @ApiResponse(responseCode = "404", description = "Facture non trouvée")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable @Parameter(description = "ID de la facture") Integer id) {
        return factureRepository.findById(id)
                .map(facture -> {
                    factureRepository.delete(facture);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}