package com.restaurant.digital.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommandeResponse {
    private Integer idCommande;
    private String utilisateurNom;
    private String utilisateurPrenom;
    private Long numeroTable;
    private LocalDateTime dateCommande;
    private String statut;
    private BigDecimal montantTotal;
    private List<LigneCommandeResponse> platsCommandes;
    private Integer nombrePlats;
}