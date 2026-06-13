package com.restaurant.digital.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@Schema(description = "Ligne d'une commande (plat + quantité + prix)")
public class LigneCommandeResponse {
    @Schema(description = "ID du plat", example = "1")
    private Integer platId;
    @Schema(description = "Nom du plat", example = "Steak frites")
    private String platNom;
    @Schema(description = "URL de l'image du plat", example = "steak-frites.jpg")
    private String platImage;
    @Schema(description = "Quantité commandée", example = "2")
    private Integer quantite;
    @Schema(description = "Prix unitaire", example = "14.50")
    private BigDecimal prixUnitaire;
    @Schema(description = "Sous-total (prix × quantité)", example = "29.00")
    private BigDecimal sousTotal;
    @Schema(description = "Instruction spéciale", example = "Sans oignons")
    private String instructionSpeciale;
}