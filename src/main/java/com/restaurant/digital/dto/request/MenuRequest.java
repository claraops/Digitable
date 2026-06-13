package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "Requête de création/modification d'un menu")
public class MenuRequest {

    @NotBlank(message = "Le nom du menu est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç\\(\\)]+$",
             message = "Le nom contient des caractères non autorisés")
    @Schema(description = "Nom du menu", example = "Menu du midi")
    private String nomMenu;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç,\\.\\(\\)!?:;]+$",
             message = "La description contient des caractères non autorisés")
    @Schema(description = "Description du menu", example = "Entrée + Plat + Dessert")
    private String descriptionMenu;

    @Schema(description = "URL de la photo", example = "menu-du-midi.jpg")
    private String photo;
    @Schema(description = "Menu actif ou non", example = "true")
    private Boolean actif;
    @Schema(description = "Prix spécial du menu", example = "15.90")
    private BigDecimal prixSpecial;
    @Schema(description = "IDs des plats composant le menu", example = "[1, 2, 3]")
    private List<Integer> platIds;

    public String getNomMenu() { return nomMenu; }
    public String getDescriptionMenu() { return descriptionMenu; }
    public String getPhoto() { return photo; }
    public Boolean getActif() { return actif; }
    public BigDecimal getPrixSpecial() { return prixSpecial; }
    public List<Integer> getPlatIds() { return platIds; }
}
