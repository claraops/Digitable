package com.restaurant.digital.service.impl;

import com.restaurant.digital.dto.response.RapportJournalier;
import com.restaurant.digital.exception.ResourceNotFoundException;
import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.model.entity.Facture;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.repository.CommandeRepository;
import com.restaurant.digital.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureService {
    
    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    
    /**
     * Crée une facture pour une commande
     */
    public Facture creerFacture(Integer idCommande, String modePaiement) {
        Commande commande = commandeRepository.findById(idCommande)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée avec l'id: " + idCommande));
        
        if (factureRepository.existsByCommandeIdCommande(idCommande)) {
            throw new IllegalStateException("Une facture existe déjà pour cette commande N°" + idCommande);
        }
        
        if (commande.getLigneCommandes() == null || commande.getLigneCommandes().isEmpty()) {
            throw new IllegalStateException("Impossible de créer une facture pour une commande vide");
        }
        
        Facture facture = new Facture();
        facture.setCommande(commande);
        facture.setModePaiement(modePaiement);
        facture.setDatePaiement(LocalDateTime.now());
        
        BigDecimal montantTotal = calculerMontantTotal(commande);
        facture.setMontant(montantTotal);
        
        Facture savedFacture = factureRepository.save(facture);
        
        commande.setStatut(StatutCommande.PAYEE);
        commandeRepository.save(commande);
        
        return savedFacture;
    }
    
    /**
     * Calcule le montant total d'une commande
     */
    private BigDecimal calculerMontantTotal(Commande commande) {
        return commande.getLigneCommandes().stream()
            .map(ligne -> {
                BigDecimal prix = ligne.getPrixUnitaire() != null ? ligne.getPrixUnitaire() : BigDecimal.ZERO;
                Short quantite = ligne.getQuantite() != null ? ligne.getQuantite() : 0;
                return prix.multiply(BigDecimal.valueOf(quantite));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Récupère le rapport des factures du jour
     */
    public RapportJournalier getRapportDuJour() {
        LocalDateTime debut = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime fin = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        
        List<Facture> factures = factureRepository.findByDatePaiementBetween(debut, fin);
        BigDecimal chiffreAffaires = factureRepository.chiffreAffairesParPeriode(debut, fin);
        Long nombreFactures = factureRepository.nombreFacturesParPeriode(debut, fin);
        BigDecimal ticketMoyen = factureRepository.ticketMoyenParPeriode(debut, fin);
        
        return RapportJournalier.builder()
            .date(LocalDateTime.now())
            .nombreFactures(nombreFactures != null ? nombreFactures : 0L)
            .chiffreAffaires(chiffreAffaires != null ? chiffreAffaires : BigDecimal.ZERO)
            .ticketMoyen(ticketMoyen != null ? ticketMoyen : BigDecimal.ZERO)
            .factures(factures)
            .build();
    }
    
    /**
     * Récupère une facture par son ID
     */
    public Facture getFactureById(Integer idFacture) {
        return factureRepository.findById(idFacture)
            .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + idFacture));
    }
    
    /**
     * Récupère une facture par commande
     */
    public Facture getFactureByCommande(Integer idCommande) {
        return factureRepository.findByCommandeIdCommande(idCommande)
            .orElseThrow(() -> new ResourceNotFoundException("Aucune facture trouvée pour la commande: " + idCommande));
    }
    
    /**
     * Récupère toutes les factures d'un utilisateur
     */
    public List<Facture> getFacturesByUtilisateur(Integer userId) {
        return factureRepository.findByUtilisateurId(userId);
    }
    
    /**
     * Récupère les factures entre deux dates
     */
    public List<Facture> getFacturesBetweenDates(LocalDateTime debut, LocalDateTime fin) {
        return factureRepository.findByDatePaiementBetween(debut, fin);
    }
    
    /**
     * Récupère les statistiques mensuelles
     */
    public List<Object[]> getStatistiquesMensuelles() {
        return factureRepository.getStatistiquesMensuelles();
    }
    
    /**
     * Calcule le chiffre d'affaires total
     */
    public BigDecimal getChiffreAffairesTotal() {
        return factureRepository.chiffreAffairesTotal();
    }
    
    /**
     * Annule une facture
     */
    @Transactional
    public void annulerFacture(Integer idFacture) {
        Facture facture = getFactureById(idFacture);
        Commande commande = facture.getCommande();
        
        factureRepository.delete(facture);
        
        if (commande.getStatut() == StatutCommande.PAYEE) {
            commande.setStatut(StatutCommande.PRETE);
            commandeRepository.save(commande);
        }
    }
}