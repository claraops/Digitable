package com.restaurant.digital.service.interfaces;

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
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureService {
    
    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    
    public Facture creerFacture(Integer idCommande, String modePaiement) {
        Commande commande = commandeRepository.findById(idCommande)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        
        if (factureRepository.existsByCommandeIdCommande(idCommande)) {
            throw new IllegalStateException("Une facture existe déjà pour cette commande");
        }
        
        Facture facture = new Facture();
        facture.setCommande(commande);
        facture.setModePaiement(modePaiement);
        facture.setDatePaiement(LocalDateTime.now());
        
        BigDecimal montantTotal = commande.getContenirs().stream()
            .map(c -> c.getPrixUnitaire().multiply(BigDecimal.valueOf(c.getQuantite())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        facture.setMontant(montantTotal);
        
        commande.setStatut(StatutCommande.PAYEE);
        commandeRepository.save(commande);
        
        return factureRepository.save(facture);
    }
    
    public RapportJournalier getRapportDuJour() {
        LocalDateTime debut = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime fin = LocalDateTime.now().with(LocalTime.MAX);
        
        BigDecimal chiffreAffaires = factureRepository.chiffreAffairesParPeriode(debut, fin);
        Long nombreFactures = factureRepository.findByDatePaiementBetween(debut, fin).stream().count();
        BigDecimal ticketMoyen = nombreFactures > 0 ? 
            chiffreAffaires.divide(BigDecimal.valueOf(nombreFactures)) : BigDecimal.ZERO;
        
        return RapportJournalier.builder()
            .date(LocalDateTime.now())
            .nombreFactures(nombreFactures)
            .chiffreAffaires(chiffreAffaires)
            .ticketMoyen(ticketMoyen)
            .build();
    }
    
    public Facture getFactureById(Integer idFacture) {
        return factureRepository.findById(idFacture)
            .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));
    }
}