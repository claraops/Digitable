package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
@Schema(description = "Ligne de commande (plat + quantité)")
public class LigneCommandeRequest {
    @NotNull(message = "L'ID plat est obligatoire")
    @Schema(description = "ID du plat", example = "5")
    private Integer platId;
    
    @NotNull(message = "La quantité est obligatoire")
    @Schema(description = "Quantité commandée", example = "2")
    private Integer quantite;
    
    @Schema(description = "Instruction spéciale pour ce plat", example = "Sans oignons")
    private String instructionSpeciale;
    
    public Integer getPlatId() { return platId; }
    public Integer getQuantite() { return quantite; }
    public String getInstructionSpeciale() { return instructionSpeciale; }
}