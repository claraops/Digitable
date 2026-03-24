package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "FACTURE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_FACTURE")
    private Integer idFacture;
    
    @OneToOne  // Relation directe avec Commande
    @JoinColumn(name = "ID_COMMANDE", nullable = false)
    private Commande commande;
    
    @Column(name = "MODE_PAIEMENT", length = 155)
    private String modePaiement;
    
    @Column(name = "MONTANT", precision = 10, scale = 2)
    private BigDecimal montant;
    
    @Column(name = "DATE_PAIEMENT")
    private LocalDateTime datePaiement;
}