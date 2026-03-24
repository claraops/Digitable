package com.restaurant.digital.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class CommandeRequest {
    @NotNull(message = "L'ID utilisateur est obligatoire")
    private Integer userId;
    
    @NotNull(message = "L'ID table est obligatoire")
    private Integer tablesId;
    
    @NotNull(message = "La liste des plats est obligatoire")
    private List<LigneCommandeRequest> plats;



}