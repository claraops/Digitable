package com.restaurant.digital.dto.response;

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
public class MenuResponse {
    private Integer idMenu;
    private String nomMenu;
    private String descriptionMenu;
    private String photo;
    private Boolean actif;
    private BigDecimal prixSpecial;
    private List<PlatResponse> plats;
}