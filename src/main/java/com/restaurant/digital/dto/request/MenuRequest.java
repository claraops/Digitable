package com.restaurant.digital.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class MenuRequest {

    @NotBlank(message = "Le nom du menu est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç\\(\\)]+$",
             message = "Le nom contient des caractères non autorisés")
    private String nomMenu;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s'\\-éèêëàâîïôùûç,\\.\\(\\)!?:;]+$",
             message = "La description contient des caractères non autorisés")
    private String descriptionMenu;

    private String photo;
    private Boolean actif;
    private BigDecimal prixSpecial;
    private List<Integer> platIds;

    public String getNomMenu() { return nomMenu; }
    public String getDescriptionMenu() { return descriptionMenu; }
    public String getPhoto() { return photo; }
    public Boolean getActif() { return actif; }
    public BigDecimal getPrixSpecial() { return prixSpecial; }
    public List<Integer> getPlatIds() { return platIds; }
}
