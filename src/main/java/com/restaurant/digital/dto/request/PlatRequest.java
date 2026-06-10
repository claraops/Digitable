package com.restaurant.digital.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PlatRequest {

    @NotBlank(message = "Le nom du plat est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç\\(\\)]+$",
             message = "Le nom contient des caractères non autorisés")
    private String nomPlat;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç,\\.\\(\\)!?:;]+$",
             message = "La description contient des caractères non autorisés")
    private String description;

    @NotNull(message = "Le prix est obligatoire")
    private BigDecimal prix;

    private Boolean disponibilite;
    private String imagePlat;
    private String categorie;
    private List<Integer> ingredientIds;

    public String getNomPlat() { return nomPlat; }
    public String getDescription() { return description; }
    public BigDecimal getPrix() { return prix; }
    public Boolean getDisponibilite() { return disponibilite; }
    public String getImagePlat() { return imagePlat; }
    public String getCategorie() { return categorie; }
    public List<Integer> getIngredientIds() { return ingredientIds; }
}
