package com.restaurant.digital.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContenirId implements Serializable {
    private Commande commande;
    private Plat plat;
}
