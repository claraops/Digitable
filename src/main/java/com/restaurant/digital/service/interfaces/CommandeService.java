package com.restaurant.digital.service.interfaces;

import com.restaurant.digital.dto.request.CommandeRequest;
import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.model.enums.StatutCommande;
import java.util.List;

public interface CommandeService {
    CommandeResponse creerCommande(CommandeRequest request);
    CommandeResponse modifierStatut(String idCommande, StatutCommande statut);
    CommandeResponse getCommandeById(String id);
    List<CommandeResponse> getCommandesByStatut(StatutCommande statut);
    Commande annulerCommande(String idCommande);
    List<CommandeResponse> getHistoriqueUtilisateur(String userId);
	Commande annulerCommande(Integer idCommande);
	List<CommandeResponse> getHistoriqueUtilisateur(Integer userId);
	CommandeResponse getCommandeById(Integer id);
	CommandeResponse modifierStatut(Integer idCommande, StatutCommande statut);
	/******ajout**********/
	List<CommandeResponse> getCommandesByTable(Integer tableId);
}