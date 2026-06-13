package com.restaurant.digital.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Schema(description = "Réponse d'une commande")
public class CommandeResponse {
    @Schema(description = "ID de la commande", example = "1")
    private Integer idCommande;
    @Schema(description = "Nom de l'utilisateur", example = "Dupont")
    private String utilisateurNom;
    @Schema(description = "Prénom de l'utilisateur", example = "Jean")
    private String utilisateurPrenom;
    @Schema(description = "Numéro de table", example = "5")
    private Long numeroTable;
    @Schema(description = "Date de la commande")
    private LocalDateTime dateCommande;
    @Schema(description = "Statut de la commande", example = "EN_ATTENTE")
    private String statut;
    @Schema(description = "Montant total", example = "42.50")
    private BigDecimal montantTotal;
    @Schema(description = "Liste des plats commandés")
    private List<LigneCommandeResponse> platsCommandes;
    @Schema(description = "Nombre total de plats", example = "3")
    private Integer nombrePlats;
}