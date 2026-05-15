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

    @Column(name = "NOM_", nullable = false, length = 100)
    private String nom;

    @Column(name = "PRENOM", nullable = false, length = 100)
    private String prenom;

    @Column(name = "EMAIL", nullable = false, length = 254, unique = true)
    private String email;

    @Column(name = "LANGUE", length = 50)
    private String langue;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false)
    private RoleUtilisateur role;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "TELEPHONE", nullable = false, length = 20)
    private String telephone;

    @OneToMany(mappedBy = "utilisateur")
    private List<Commande> commandes = new ArrayList<>();
}