package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.model.enums.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {
    List<Commande> findByUtilisateur(Utilisateur utilisateur);
    List<Commande> findByTables(Tables tables);
    List<Commande> findByStatut(StatutCommande statut);
    List<Commande> findByDateCommandeBetween(LocalDateTime debut, LocalDateTime fin);
}