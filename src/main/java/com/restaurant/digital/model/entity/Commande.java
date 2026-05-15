package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.restaurant.digital.model.enums.StatutCommande;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "COMMANDE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_COMMANDE")
    private Integer idCommande;
    
    @ManyToOne
    @JoinColumn(name = "_ID_USER", nullable = false)
    private Utilisateur utilisateur;
    
    @ManyToOne
    @JoinColumn(name = "_ID_TABLES", nullable = false)
    private Tables tables;
    
    @Column(name = "DATE_COMMANDE", nullable = false)
    private LocalDateTime dateCommande;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUT", nullable = false, length = 254)
    private StatutCommande statut;
    
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<Contenir> contenirs = new ArrayList<>();
   
    
    @OneToOne(mappedBy = "commande")
    private Facture facture;
    
    @OneToOne(mappedBy = "commande")
    private Avis avis;
}