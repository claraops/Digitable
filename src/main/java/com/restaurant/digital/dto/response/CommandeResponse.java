package com.restaurant.digital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeResponse {
    
    private Integer idCommande;                 // Changé de String à Integer
    private String utilisateurNom;               // Nom de l'utilisateur qui a passé la commande
    private String utilisateurPrenom;             // Prénom de l'utilisateur (optionnel)
    private Long numeroTable;                     // Numéro de la table
    private LocalDateTime dateCommande;           // Date et heure de la commande
    private String statut;                         // Statut de la commande (EN_ATTENTE, etc.)
    private BigDecimal montantTotal;               // Montant total calculé
    
    private List<LigneCommandeResponse> platsCommandes;  // Liste des plats commandés
    
    // Informations supplémentaires optionnelles
    private String modePaiement;                   // Mode de paiement si déjà payé
    private LocalDateTime datePaiement;             // Date de paiement si déjà payé
    private Integer idFacture;                      // ID de la facture si générée
	public void setNombrePlats(int size) {
		// TODO Auto-generated method stub
		
	}
}