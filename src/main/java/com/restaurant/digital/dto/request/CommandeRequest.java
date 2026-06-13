package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@Schema(description = "Requête de création d'une commande")
public class CommandeRequest {
    @NotNull(message = "L'ID utilisateur est obligatoire")
    @Schema(description = "ID de l'utilisateur", example = "1")
    private Integer userId;
    
    @NotNull(message = "L'ID table est obligatoire")
    @Schema(description = "ID de la table", example = "3")
    private Integer tablesId;
    
    @NotNull(message = "La liste des plats est obligatoire")
    @Schema(description = "Liste des plats commandés")
    private List<LigneCommandeRequest> plats;
    
    public Integer getUserId() { return userId; }
    public Integer getTablesId() { return tablesId; }
    public List<LigneCommandeRequest> getPlats() { return plats; }
}

