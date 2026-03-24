package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.LigneCommande;
import com.restaurant.digital.model.entity.LigneCommandeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, LigneCommandeId> {
    
    // Trouver toutes les lignes d'une commande
    List<LigneCommande> findByCommandeIdCommande(Integer idCommande);
    
    // Trouver toutes les lignes pour un plat
    List<LigneCommande> findByPlatIdPlat(Integer idPlat);
    
    // Compter le nombre de fois qu'un plat a été commandé
    @Query("SELECT COUNT(lc) FROM LigneCommande lc WHERE lc.plat.idPlat = :platId")
    Long countByPlatId(@Param("platId") Integer platId);
    
    // Supprimer toutes les lignes d'une commande
    void deleteByCommandeIdCommande(Integer idCommande);
}