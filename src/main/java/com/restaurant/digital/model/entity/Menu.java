package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "MENU")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_MENU")
    private Integer idMenu;  // Changé de String à Integer
    
    @Column(name = "NOMMENU", length = 155)
    private String nomMenu;
    
    @Column(name = "DATE_CREATION")
    private LocalDateTime dateCreation;
    
    @Column(name = "ACTIF")
    private Boolean actif;
    
    @ManyToMany
    @JoinTable(
        name = "INCLURE",
        joinColumns = @JoinColumn(name = "ID_MENU"),
        inverseJoinColumns = @JoinColumn(name = "ID_PLAT")
    )
    private List<Plat> plats = new ArrayList<>();
    
    @Column(name = "PRIX_SPECIAL", precision = 10, scale = 2)  // Ajouté
    private BigDecimal prixSpecial;
}