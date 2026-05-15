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
}