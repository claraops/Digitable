package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Commande;
import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.model.enums.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {
    
    // ✅ CORRIGÉ : findByTables (avec 's')
    List<Commande> findByTables(Tables tables);
    
    // ✅ CORRIGÉ : findByTablesId (recherche par ID de table)
    List<Commande> findByTablesIdTables(Integer idTables);
    
    // ✅ OK : findByUtilisateur (car attribut = utilisateur)
    List<Commande> findByUtilisateur(Utilisateur utilisateur);
    
    // ✅ OK : findByStatut
    List<Commande> findByStatut(StatutCommande statut);
    
    // ✅ OK : findByDateCommandeBetween
    List<Commande> findByDateCommandeBetween(LocalDateTime debut, LocalDateTime fin);
    
    // ✅ Méthode personnalisée avec JPQL
    @Query("SELECT c FROM Commande c WHERE c.tables.numeroTable = :numeroTable")
    List<Commande> findByNumeroTable(@Param("numeroTable") Long numeroTable);
    
    // ✅ Méthode personnalisée avec JPQL
    @Query("SELECT c FROM Commande c WHERE c.utilisateur.idUser = :userId ORDER BY c.dateCommande DESC")
    List<Commande> findHistoriqueUtilisateur(@Param("userId") Integer userId);
    
    // ✅ Compter les commandes par statut
    @Query("SELECT c.statut, COUNT(c) FROM Commande c GROUP BY c.statut")
    List<Object[]> countByStatut();
    
    // ✅ Commandes du jour
    @Query("SELECT c FROM Commande c WHERE DATE(c.dateCommande) = CURRENT_DATE")
    List<Commande> findCommandesDuJour();

	
}