package com.restaurant.digital.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PlatRequest {
    private String nomPlat;
    private String description;
    private BigDecimal prix;
    private Boolean disponibilite;
    private String imagePlat;
    private String categorie;
    private List<Integer> ingredientIds;
    
    // Getters manuels si Lombok ne fonctionne pas
    public String getNomPlat() { return nomPlat; }
    public String getDescription() { return description; }
    public BigDecimal getPrix() { return prix; }
    public Boolean getDisponibilite() { return disponibilite; }
    public String getImagePlat() { return imagePlat; }
    public String getCategorie() { return categorie; }
    public List<Integer> getIngredientIds() { return ingredientIds; }
}