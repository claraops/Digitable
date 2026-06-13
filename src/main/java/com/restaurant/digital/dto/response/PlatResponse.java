package com.restaurant.digital.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse d'un plat")
public class PlatResponse {
    @Schema(description = "ID du plat", example = "1")
    private Integer idPlat;
    @Schema(description = "Nom du plat", example = "Steak frites")
    private String nomPlat;
    @Schema(description = "Description", example = "Steak grillé et frites maison")
    private String description;
    @Schema(description = "Prix", example = "14.50")
    private BigDecimal prix;
    @Schema(description = "Disponible", example = "true")
    private Boolean disponibilite;
    @Schema(description = "URL de l'image", example = "steak-frites.jpg")
    private String imagePlat;
    @Schema(description = "Catégorie", example = "PLAT_PRINCIPAL")
    private String categorie; 
    @Schema(description = "Liste des ingrédients", example = "[\"Boeuf\", \"Pommes de terre\"]")
    private List<String> ingredients;
}