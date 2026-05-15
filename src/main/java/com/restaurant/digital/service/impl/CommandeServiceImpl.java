package com.restaurant.digital.service.impl;

import com.restaurant.digital.dto.request.CommandeRequest;
import com.restaurant.digital.dto.request.LigneCommandeRequest;
import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.dto.response.LigneCommandeResponse;
import com.restaurant.digital.exception.ResourceNotFoundException;
import com.restaurant.digital.model.entity.*;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.model.enums.StatutTable;
import com.restaurant.digital.repository.*;
import com.restaurant.digital.service.interfaces.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TablesRepository tablesRepository;
    private final PlatRepository platRepository;
    private final ContenirRepository contenirRepository;
    private final FactureRepository factureRepository;

    @Override
    public CommandeResponse creerCommande(CommandeRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Tables table = tablesRepository.findById(request.getTablesId())
                .orElseThrow(() -> new ResourceNotFoundException("Table non trouvée"));

        if (table.getStatut() != StatutTable.LIBRE) {
            throw new IllegalStateException("La table n'est pas disponible");
        }

        table.setStatut(StatutTable.OCCUPEE);
        tablesRepository.save(table);

        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setTables(table);
        commande.setDateCommande(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);

        Commande savedCommande = commandeRepository.save(commande);

        List<Contenir> contenirs = new ArrayList<>();
        BigDecimal montantTotal = BigDecimal.ZERO;

        for (LigneCommandeRequest ligne : request.getPlats()) {
            Plat plat = platRepository.findById(ligne.getPlatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plat non trouvé"));

            Contenir contenir = new Contenir();
            contenir.setCommande(savedCommande);
            contenir.setPlat(plat);
            contenir.setQuantite(ligne.getQuantite());
            contenir.setPrixUnitaire(plat.getPrix());
            contenir.setInstructionSpeciale(ligne.getInstructionSpeciale());

            contenirs.add(contenirRepository.save(contenir));

            montantTotal = montantTotal.add(plat.getPrix().multiply(BigDecimal.valueOf(ligne.getQuantite())));
        }

        savedCommande.setContenirs(contenirs);
        return mapToResponse(savedCommande, montantTotal);
    }

    @Override
    public CommandeResponse modifierStatut(Integer idCommande, StatutCommande statut) {
        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        commande.setStatut(statut);

        if (statut == StatutCommande.SERVIE) {
            Tables table = commande.getTables();
            table.setStatut(StatutTable.A_NETTOYER);
            tablesRepository.save(table);
        }

        if (statut == StatutCommande.PAYEE && commande.getFacture() == null) {
            creerFacture(commande);
        }

        return mapToResponse(commande, calculerMontantTotal(commande));
    }

    @Override
    public CommandeResponse getCommandeById(Integer id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        return mapToResponse(commande, calculerMontantTotal(commande));
    }

    @Override
    public List<CommandeResponse> getCommandesByStatut(StatutCommande statut) {
        return commandeRepository.findByStatut(statut).stream()
                .map(c -> mapToResponse(c, calculerMontantTotal(c)))
                .collect(Collectors.toList());
    }

    @Override
    public Commande annulerCommande(Integer idCommande) {
        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new IllegalStateException("Impossible d'annuler une commande déjà en préparation ou servie");
        }

        commande.setStatut(StatutCommande.ANNULEE);
        Tables table = commande.getTables();
        table.setStatut(StatutTable.LIBRE);
        tablesRepository.save(table);

        return commandeRepository.save(commande);
    }

    @Override
    public List<CommandeResponse> getHistoriqueUtilisateur(Integer userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        return commandeRepository.findByUtilisateur(utilisateur).stream()
                .map(c -> mapToResponse(c, calculerMontantTotal(c)))
                .collect(Collectors.toList());
    }

    private void creerFacture(Commande commande) {
        Facture facture = new Facture();
        facture.setCommande(commande);
        facture.setMontant(calculerMontantTotal(commande));
        facture.setDatePaiement(LocalDateTime.now());
        facture.setModePaiement("CARTE");
        factureRepository.save(facture);
    }

    private CommandeResponse mapToResponse(Commande commande, BigDecimal montantTotal) {
        List<LigneCommandeResponse> lignes = commande.getContenirs().stream()
                .map(c -> LigneCommandeResponse.builder()
                        .platNom(c.getPlat().getNomPlat())
                        .platImage(c.getPlat().getImagePlat())
                        .quantite(c.getQuantite())
                        .prixUnitaire(c.getPrixUnitaire())
                        .sousTotal(c.getPrixUnitaire().multiply(BigDecimal.valueOf(c.getQuantite())))
                        .instructionSpeciale(c.getInstructionSpeciale())
                        .build())
                .collect(Collectors.toList());

        return CommandeResponse.builder()
                .idCommande(commande.getIdCommande())
                .utilisateurNom(commande.getUtilisateur().getNom())
                .utilisateurPrenom(commande.getUtilisateur().getPrenom())
                .numeroTable(commande.getTables().getNumeroTable())
                .dateCommande(commande.getDateCommande())
                .statut(commande.getStatut().toString())
                .montantTotal(montantTotal)
                .platsCommandes(lignes)
                .nombrePlats(lignes.size())
                .build();
    }

    private BigDecimal calculerMontantTotal(Commande commande) {
        return commande.getContenirs().stream()
                .map(c -> c.getPrixUnitaire().multiply(BigDecimal.valueOf(c.getQuantite())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    @Override
    public List<CommandeResponse> getAllCommandes() {
        return commandeRepository.findAll().stream()
                .map(c -> mapToResponse(c, calculerMontantTotal(c)))
                .collect(Collectors.toList());
    }
}