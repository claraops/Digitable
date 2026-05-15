package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "CONTENIR")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ContenirId.class)
public class Contenir {

    @Id
    @ManyToOne
    @JoinColumn(name = "_ID_COMMANDE", nullable = false)
    private Commande commande;

    @Id
    @ManyToOne
    @JoinColumn(name = "_ID_PLAT", nullable = false)
    private Plat plat;

    @Column(name = "QUANTITE", nullable = false)
    private Integer quantite;

    @Column(name = "PRIX_UNITAIRE", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "INSTRUCTION_SPECIALE", columnDefinition = "TEXT")
    private String instructionSpeciale;
}