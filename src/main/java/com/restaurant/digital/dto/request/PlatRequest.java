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
}