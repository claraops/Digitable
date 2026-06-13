package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "Requête de création/modification d'un plat")
public class PlatRequest {

    @NotBlank(message = "Le nom du plat est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç\\(\\)]+$",
             message = "Le nom contient des caractères non autorisés")
    @Schema(description = "Nom du plat", example = "Steak frites")
    private String nomPlat;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç,\\.\\(\\)!?:;]+$",
             message = "La description contient des caractères non autorisés")
    @Schema(description = "Description du plat", example = "Steak grillé accompagné de frites maison")
    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Schema(description = "Prix du plat", example = "14.50")
    private BigDecimal prix;

    @Schema(description = "Disponibilité du plat", example = "true")
    private Boolean disponibilite;
    @Schema(description = "URL de l'image", example = "steak-frites.jpg")
    private String imagePlat;
    @Schema(description = "Catégorie du plat", example = "PLAT_PRINCIPAL")
    private String categorie;
    @Schema(description = "IDs des ingrédients", example = "[1, 2, 3]")
    private List<Integer> ingredientIds;

    public String getNomPlat() { return nomPlat; }
    public String getDescription() { return description; }
    public BigDecimal getPrix() { return prix; }
    public Boolean getDisponibilite() { return disponibilite; }
    public String getImagePlat() { return imagePlat; }
    public String getCategorie() { return categorie; }
    public List<Integer> getIngredientIds() { return ingredientIds; }
}
