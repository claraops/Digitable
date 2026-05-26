package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private Integer idMenu;
    
    @Column(name = "NOMMENU", nullable = false, length = 254)
    private String nomMenu;
    
    @Column(name = "DATE_CREATION", nullable = false)
    private LocalDateTime dateCreation;
    
    @Column(name = "ACTIF")
    private Boolean actif;
    
    @Column(name = "DESCRIPTION_MENU", nullable = false, columnDefinition = "TEXT")
    private String descriptionMenu;
    
    @Column(name = "PHOTO", nullable = false, length = 254)
    private String photo;
   
    @ManyToMany
    @JoinTable(
        name = "INCLURE",
        joinColumns = @JoinColumn(name = "_ID_MENU"),
        inverseJoinColumns = @JoinColumn(name = "ID_PLAT")
    )
    @JsonIgnoreProperties("menus")
    private List<Plat> plats = new ArrayList<>();
    
    @Column(name = "PRIX_SPECIAL")
    private BigDecimal prixSpecial;
}