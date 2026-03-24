package com.restaurant.digital.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.restaurant.digital.model.enums.RoleUtilisateur;
import java.util.*;

@Entity
@Table(name = "UTILISATEUR")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    @Column(name = "ID_USER")
    private Integer idUser;  
    
    @Column(name = "NOM_", length = 155)  
    private String nom;
    
    @Column(name = "PRENOM", length = 155)
    private String prenom;
    
    @Column(name = "EMAIL", length = 155, unique = true)
    private String email;
    
    @Column(name = "LANGUE", length = 155)
    private String langue;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", length = 155)
    private RoleUtilisateur role;
    
    @OneToMany(mappedBy = "utilisateur")
    private List<Commande> commandes = new ArrayList<>();
}