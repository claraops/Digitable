package com.restaurant.digital.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeId implements Serializable {
    private Integer idLigne;  // Changé de String à Integer
    private Commande commande;  // Changé de String à Commande
    private Plat plat;  // Changé de String à Plat
    
    // Note: Dans une clé composite avec @ManyToOne, 
    // JPA utilise l'objet lui-même, pas son ID
}