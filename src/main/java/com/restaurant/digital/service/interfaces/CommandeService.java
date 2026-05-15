package com.restaurant.digital.service.interfaces;

import com.restaurant.digital.dto.request.CommandeRequest;
import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.model.enums.StatutCommande;
import java.util.List;

public interface CommandeService {
    CommandeResponse creerCommande(CommandeRequest request);
    CommandeResponse modifierStatut(Integer idCommande, StatutCommande statut);
    CommandeResponse getCommandeById(Integer id);
    List<CommandeResponse> getCommandesByStatut(StatutCommande statut);
    Commande annulerCommande(Integer idCommande);
    List<CommandeResponse> getHistoriqueUtilisateur(Integer userId);
    List<CommandeResponse> getAllCommandes(); // nouvelle méthode
}