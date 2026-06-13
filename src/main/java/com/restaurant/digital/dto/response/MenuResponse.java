package com.restaurant.digital.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Réponse d'un menu avec ses plats")
public class MenuResponse {
    @Schema(description = "ID du menu", example = "1")
    private Integer idMenu;
    @Schema(description = "Nom du menu", example = "Menu du midi")
    private String nomMenu;
    @Schema(description = "Description", example = "Entrée + Plat + Dessert")
    private String descriptionMenu;
    @Schema(description = "URL de la photo", example = "menu-midi.jpg")
    private String photo;
    @Schema(description = "Menu actif", example = "true")
    private Boolean actif;
    @Schema(description = "Prix spécial", example = "15.90")
    private BigDecimal prixSpecial;
    @Schema(description = "Plats composant le menu")
    private List<PlatResponse> plats;
}