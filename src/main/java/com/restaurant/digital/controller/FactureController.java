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
    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures() {
        List<Facture> factures = factureRepository.findAll();
        return ResponseEntity.ok(factures);
    }

    /**
     * Récupérer une facture par son ID
     * GET /api/v1/factures/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable Integer id) {
        return factureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer la facture d'une commande
     * GET /api/v1/factures/commande/{commandeId}
     */
    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<Facture> getFactureByCommande(@PathVariable Integer commandeId) {
        return factureRepository.findByCommandeIdCommande(commandeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer les factures par mode de paiement
     * GET /api/v1/factures/paiement/{mode}
     */
    @GetMapping("/paiement/{mode}")
    public ResponseEntity<List<Facture>> getFacturesByModePaiement(@PathVariable String mode) {
        List<Facture> factures = factureRepository.findByModePaiement(mode);
        return ResponseEntity.ok(factures);
    }

    /**
     * Récupérer les factures entre deux dates
     * GET /api/v1/factures/periode?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @GetMapping("/periode")
    public ResponseEntity<List<Facture>> getFacturesByPeriode(
            @RequestParam String debut,
            @RequestParam String fin) {
        
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
    @GetMapping("/rapport/journalier")
    public ResponseEntity<RapportJournalier> getRapportJournalier() {
        RapportJournalier rapport = factureService.getRapportDuJour();
        return ResponseEntity.ok(rapport);
    }

    /**
     * Chiffre d'affaires total
     * GET /api/v1/factures/stats/ca-total
     */
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
    @GetMapping("/stats/ca-periode")
    public ResponseEntity<Map<String, BigDecimal>> getChiffreAffairesParPeriode(
            @RequestParam String debut,
            @RequestParam String fin) {
        
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
    @GetMapping("/stats/ticket-moyen")
    public ResponseEntity<Map<String, BigDecimal>> getTicketMoyenParPeriode(
            @RequestParam String debut,
            @RequestParam String fin) {
        
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
    @GetMapping("/stats/par-mode")
    public ResponseEntity<List<Object[]>> getStatistiquesParModePaiement() {
        return ResponseEntity.ok(factureRepository.statistiquesParModePaiement());
    }

    /**
     * Statistiques mensuelles
     * GET /api/v1/factures/stats/mensuelles
     */
    @GetMapping("/stats/mensuelles")
    public ResponseEntity<List<Object[]>> getStatistiquesMensuelles() {
        return ResponseEntity.ok(factureRepository.getStatistiquesMensuelles());
    }

    /**
     * Factures du jour
     * GET /api/v1/factures/jour
     */
    @GetMapping("/jour")
    public ResponseEntity<List<Facture>> getFacturesDuJour() {
        return ResponseEntity.ok(factureRepository.facturesDuJour());
    }

    /**
     * Factures de la semaine
     * GET /api/v1/factures/semaine
     */
    @GetMapping("/semaine")
    public ResponseEntity<List<Facture>> getFacturesDeLaSemaine() {
        return ResponseEntity.ok(factureRepository.facturesDeLaSemaine());
    }

    /**
     * Factures du mois
     * GET /api/v1/factures/mois
     */
    @GetMapping("/mois")
    public ResponseEntity<List<Facture>> getFacturesDuMois() {
        return ResponseEntity.ok(factureRepository.facturesDuMois());
    }

    /**
     * Vérifier si une commande a une facture
     * GET /api/v1/factures/commande/{commandeId}/existe
     */
    @GetMapping("/commande/{commandeId}/existe")
    public ResponseEntity<Map<String, Boolean>> existeFacturePourCommande(@PathVariable Integer commandeId) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("existe", factureRepository.existsByCommandeIdCommande(commandeId));
        return ResponseEntity.ok(response);
    }

    /**
     * Supprimer une facture
     * DELETE /api/v1/factures/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Integer id) {
        return factureRepository.findById(id)
                .map(facture -> {
                    factureRepository.delete(facture);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}