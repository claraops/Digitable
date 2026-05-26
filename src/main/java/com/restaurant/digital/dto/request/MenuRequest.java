package com.restaurant.digital.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class MenuRequest {
    private String nomMenu;
    private String descriptionMenu;
    private String photo;
    private Boolean actif;
    private BigDecimal prixSpecial;
    private List<Integer> platIds;
    
    // Si Lombok ne fonctionne pas, ajoutez manuellement :
    public String getNomMenu() { return nomMenu; }
    public String getDescriptionMenu() { return descriptionMenu; }
    public String getPhoto() { return photo; }
    public Boolean getActif() { return actif; }
    public BigDecimal getPrixSpecial() { return prixSpecial; }
    public List<Integer> getPlatIds() { return platIds; }
}