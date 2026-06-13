package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requête de création d'un avis")
public class AvisRequest {

    @NotNull(message = "L'ID de la commande est obligatoire")
    @Schema(description = "ID de la commande associée", example = "1")
    private Integer commandeId;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    @Schema(description = "Note sur 5", example = "4")
    private String note;

    @Size(max = 1000, message = "Le commentaire ne doit pas dépasser 1000 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç,\\.\\(\\)!?:;@#$%&*+=/\\\\[\\]\"_~|`{}]+$",
             message = "Le commentaire contient des caractères non autorisés")
    @Schema(description = "Commentaire optionnel", example = "Très bon repas, service rapide !")
    private String commentaire;
}
