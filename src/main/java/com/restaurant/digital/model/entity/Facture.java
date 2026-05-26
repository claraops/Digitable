package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    
    @OneToOne
    @JoinColumn(name = "_ID_COMMANDE", nullable = false)
    @JsonIgnore  // ← CHANGER: @JsonIgnoreProperties -> @JsonIgnore
    private Commande commande;
    
    @Column(name = "MODE_PAIEMENT", nullable = false, length = 254)
    private String modePaiement;
    
    @Column(name = "MONTANT", nullable = false)
    private BigDecimal montant;
    
    @Column(name = "DATE_PAIEMENT", nullable = false)
    private LocalDateTime datePaiement;
}