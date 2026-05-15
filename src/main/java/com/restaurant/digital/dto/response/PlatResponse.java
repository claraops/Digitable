package com.restaurant.digital.dto.response;

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
public class PlatResponse {
    private Integer idPlat;
    private String nomPlat;
    private String description;
    private BigDecimal prix;
    private Boolean disponibilite;
    private String imagePlat;
    private String categorie; 
    private List<String> ingredients;
}