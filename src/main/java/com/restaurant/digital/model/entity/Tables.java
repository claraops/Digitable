package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.restaurant.digital.model.enums.StatutTable;
import java.util.*;

@Entity
@Table(name = "TABLES")  
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tables {  
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TABLES")  
    private Integer idTables;  
    
    @Column(name = "NUMEROTABLE", nullable = false)
    private Long numeroTable;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUT", nullable = false, length = 155)
    private StatutTable statut;
    
    @Column(name = "CAPACITE")
    private Short capacite;
    
    @OneToMany(mappedBy = "tables")  
    private List<Commande> commandes = new ArrayList<>();
}