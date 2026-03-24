package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "LIGNE_COMMANDE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(LigneCommandeId.class)
public class LigneCommande {
    
    @Id
    @Column(name = "ID_LIGNE")
    private Integer idLigne;  // ❌ SUPPRIMEZ @GeneratedValue
    
    @Id
    @ManyToOne
    @JoinColumn(name = "ID_COMMANDE", nullable = false)
    private Commande commande;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "ID_PLAT", nullable = false)
    private Plat plat;
    
    @Column(name = "QUANTITE")
    private Short quantite;
    
    @Column(name = "PRIX_UNITAIRE", precision = 10, scale = 2)
    private BigDecimal prixUnitaire;
    
    @Column(name = "INSTRUCTIONS_SPECIALES", length = 155)
    private String instructionsSpeciales;
}