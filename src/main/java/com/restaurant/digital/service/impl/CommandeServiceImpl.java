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
import java.time.LocalDateTime;
import java.util.*;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeServiceImpl implements CommandeService {
    
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TablesRepository tablesRepository;
    private final PlatRepository platRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final FactureRepository factureRepository;
    
    @Override
    public CommandeResponse creerCommande(CommandeRequest request) {
        // Récupérer l'utilisateur
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + request.getUserId()));
        
        // Récupérer la table
        Tables table = tablesRepository.findById(request.getTablesId())
            .orElseThrow(() -> new ResourceNotFoundException("Table non trouvée avec l'id: " + request.getTablesId()));
        
        // Vérifier que la table est libre
        if (table.getStatut() != StatutTable.LIBRE) {
            throw new IllegalStateException("La table n'est pas disponible. Statut actuel: " + table.getStatut());
        }
        
        // Occuper la table
        tablesRepository.updateStatut(table.getIdTables(), StatutTable.OCCUPEE);
        
        // Créer la commande
        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setTables(table);
        commande.setDateCommande(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);
        
        Commande savedCommande = commandeRepository.save(commande);
        
        // Créer les lignes de commande
        List<LigneCommande> lignes = new ArrayList<>();
        BigDecimal montantTotal = BigDecimal.ZERO;
        
        for (LigneCommandeRequest ligneRequest : request.getPlats()) {
            Plat plat = platRepository.findById(ligneRequest.getPlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Plat non trouvé avec l'id: " + ligneRequest.getPlatId()));
            
            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(savedCommande);
            ligne.setPlat(plat);
            ligne.setQuantite(ligneRequest.getQuantite());
            ligne.setPrixUnitaire(plat.getPrix());
            ligne.setInstructionsSpeciales(ligneRequest.getInstructionsSpeciales());
            
            LigneCommande savedLigne = ligneCommandeRepository.save(ligne);
            lignes.add(savedLigne);
            
            BigDecimal sousTotal = plat.getPrix()
                .multiply(BigDecimal.valueOf(ligneRequest.getQuantite()));
            montantTotal = montantTotal.add(sousTotal);
        }
        
        savedCommande.setLigneCommandes(lignes);
        
        return mapToResponse(savedCommande, montantTotal);
    }
    
    @Override
    public CommandeResponse modifierStatut(Integer idCommande, StatutCommande statut) {
        Commande commande = commandeRepository.findById(idCommande)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée avec l'id: " + idCommande));
        
        commande.setStatut(statut);
        
        // Si la commande est servie, libérer la table
        if (statut == StatutCommande.SERVIE) {
            tablesRepository.updateStatut(commande.getTables().getIdTables(), StatutTable.A_NETTOYER);
        }
        
        // Si la commande est payée, créer la facture
        if (statut == StatutCommande.PAYEE && commande.getFacture() == null) {
            creerFacture(commande);
        }
        
        Commande updated = commandeRepository.save(commande);
        
        return mapToResponse(updated, calculerMontantTotal(updated));
    }
    
    private void creerFacture(Commande commande) {
        Facture facture = new Facture();
        facture.setCommande(commande);
        facture.setMontant(calculerMontantTotal(commande));
        facture.setDatePaiement(LocalDateTime.now());
        facture.setModePaiement("CARTE"); // Valeur par défaut
        factureRepository.save(facture);
    }
    
    @Override
    public CommandeResponse getCommandeById(Integer id) {
        Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée avec l'id: " + id));
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
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée avec l'id: " + idCommande));
        
        if (commande.getStatut() == StatutCommande.EN_ATTENTE) {
            commande.setStatut(StatutCommande.ANNULEE);
            // Libérer la table
            tablesRepository.updateStatut(commande.getTables().getIdTables(), StatutTable.LIBRE);
            return commandeRepository.save(commande);
        } else {
            throw new IllegalStateException("Impossible d'annuler une commande déjà en préparation ou servie");
        }
    }
    
    @Override
    public List<CommandeResponse> getHistoriqueUtilisateur(Integer userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + userId));
        
        return commandeRepository.findByUtilisateur(utilisateur).stream()
            .map(c -> mapToResponse(c, calculerMontantTotal(c)))
            .collect(Collectors.toList());
    }
    
    private CommandeResponse mapToResponse(Commande commande, BigDecimal montantTotal) {
        CommandeResponse response = new CommandeResponse();
        response.setIdCommande(commande.getIdCommande());
        response.setUtilisateurNom(commande.getUtilisateur().getNom());
        response.setUtilisateurPrenom(commande.getUtilisateur().getPrenom());
        response.setNumeroTable(commande.getTables().getNumeroTable());
        response.setDateCommande(commande.getDateCommande());
        response.setStatut(commande.getStatut().toString());
        response.setMontantTotal(montantTotal);
        
        List<LigneCommandeResponse> lignesResponse = commande.getLigneCommandes().stream()
            .map(l -> {
                LigneCommandeResponse ligneResponse = new LigneCommandeResponse();
                ligneResponse.setPlatNom(l.getPlat().getNomPlat());
                ligneResponse.setQuantite(l.getQuantite());
                ligneResponse.setPrixUnitaire(l.getPrixUnitaire());
                ligneResponse.setInstructionsSpeciales(l.getInstructionsSpeciales());
                ligneResponse.setSousTotal(
                    l.getPrixUnitaire().multiply(BigDecimal.valueOf(l.getQuantite()))
                );
                return ligneResponse;
            })
            .collect(Collectors.toList());
        
        response.setPlatsCommandes(lignesResponse);
        response.setNombrePlats(lignesResponse.size());
        
        if (commande.getFacture() != null) {
            response.setIdFacture(commande.getFacture().getIdFacture());
            response.setModePaiement(commande.getFacture().getModePaiement());
            response.setDatePaiement(commande.getFacture().getDatePaiement());
        }
        
        return response;
    }
    
    private BigDecimal calculerMontantTotal(Commande commande) {
        return commande.getLigneCommandes().stream()
            .map(l -> {
                BigDecimal prix = l.getPrixUnitaire() != null ? l.getPrixUnitaire() : BigDecimal.ZERO;
                Short quantite = l.getQuantite() != null ? l.getQuantite() : 0;
                return prix.multiply(BigDecimal.valueOf(quantite));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

	@Override
	public CommandeResponse modifierStatut(String idCommande, StatutCommande statut) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CommandeResponse getCommandeById(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Commande annulerCommande(String idCommande) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<CommandeResponse> getHistoriqueUtilisateur(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<CommandeResponse> getCommandesByTable(Integer tableId) {
		// TODO Auto-generated method stub
		return null;
	}
}