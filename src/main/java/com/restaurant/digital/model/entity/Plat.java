package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.*;

import com.restaurant.digital.model.enums.CategoriePlat;

@Entity
@Table(name = "PLAT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PLAT")
    private Integer idPlat;
    
    @Column(name = "NOM_PLAT", nullable = false, length = 254)
    private String nomPlat;
    
    @Column(name = "DESCRIPTION", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "PRIX", nullable = false)
    private BigDecimal prix;
    
    @Column(name = "DISPONIBILITE")
    private Boolean disponibilite;
    
    @Column(name = "IMAGE_PLAT", nullable = false, length = 254)
    private String imagePlat;
    
 // dans Plat.java
    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORIE", nullable = false, length = 50)
    private CategoriePlat categorie;
    
    @OneToMany(mappedBy = "plat")
    private List<Contenir> contenirs = new ArrayList<>();
    
    @ManyToMany(mappedBy = "plats")
    private List<Menu> menus = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "CONSTITUER",
        joinColumns = @JoinColumn(name = "_ID_PLAT"),
        inverseJoinColumns = @JoinColumn(name = "_ID_INGREDIENT")
    )
    private List<Ingredient> ingredients = new ArrayList<>();
}