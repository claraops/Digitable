package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "PLAT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PLAT")
    private Integer idPlat;  // Changé de String à Integer
    
    @Column(name = "NOM_PLAT", length = 155)
    private String nomPlat;
    
    @Column(name = "DESCRIPTION", columnDefinition = "text")  // Changé pour TEXT
    private String description;
    
    @Column(name = "PRIX", precision = 10, scale = 2)  // decimal
    private BigDecimal prix;
    
    @Column(name = "DISPONIBILITE")
    private Boolean disponibilite;
    
    @OneToMany(mappedBy = "plat")
    private List<LigneCommande> ligneCommandes = new ArrayList<>();
    
    @ManyToMany(mappedBy = "plats")
    private List<Menu> menus = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "CONSTITUER",  // Nom changé
        joinColumns = @JoinColumn(name = "ID_PLAT"),
        inverseJoinColumns = @JoinColumn(name = "ID_INGREDIENT")
    )
    private List<Ingredient> ingredients = new ArrayList<>();
}