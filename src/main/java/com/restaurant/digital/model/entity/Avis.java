package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "AVIS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_AVIS")
    private Integer idAvis;  // Changé de String à Integer
    
    @OneToOne
    @JoinColumn(name = "ID_COMMANDE", nullable = false)
    private Commande commande;
    
    @Column(name = "NOTE")
    private Byte note;  // Changé pour correspondre à tinyint
    
    @Column(name = "COMMENTAIRE", length = 155)
    private String commentaire;
    
    @Column(name = "DATE_AVIS", nullable = false)
    private LocalDateTime dateAvis;
}