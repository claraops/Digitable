package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;

@Entity
@Table(name = "INGREDIENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_INGREDIENT")
    private Integer idIngredient;  // Changé de String à Integer
    
    @Column(name = "NOM_INGREDIANT", nullable = false, length = 155)
    private String nomIngredient;
    
    @Column(name = "ISALLERGENE")
    private Boolean isAllergene;
    
    @ManyToMany(mappedBy = "ingredients")
    private List<Plat> plats = new ArrayList<>();
}