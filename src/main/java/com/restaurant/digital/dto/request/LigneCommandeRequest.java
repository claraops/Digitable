package com.restaurant.digital.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class LigneCommandeRequest {
    @NotNull(message = "L'ID plat est obligatoire")
    private Integer platId;
    
    @NotNull(message = "La quantité est obligatoire")
    private Integer quantite;
    
    private String instructionSpeciale;
}