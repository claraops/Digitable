package com.restaurant.digital.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LigneCommandeResponse {
    private String platNom;
    private Short quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal sousTotal;
    private String instructionsSpeciales;  // Nouveau champ
}