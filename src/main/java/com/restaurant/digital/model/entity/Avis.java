package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Integer idAvis;
    
    @ManyToOne
    @JoinColumn(name = "_ID_COMMANDE", nullable = false)
    @JsonIgnore 
    private Commande commande;
    
    @Column(name = "NOTE", length = 254)
    private String note;
    
    @Column(name = "COMMENTAIRE", length = 254)
    private String commentaire;
    
    @Column(name = "DATE_AVIS", nullable = false)
    private LocalDateTime dateAvis;
}