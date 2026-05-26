package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.enums.StatutTable;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Integer> {
    
    // ========== RECHERCHES DE BASE ==========
    Optional<Tables> findByNumeroTable(Long numeroTable);
    List<Tables> findByStatut(StatutTable statut);
    List<Tables> findByCapaciteGreaterThanEqual(Short capacite);
    boolean existsByNumeroTable(Long numeroTable);
    
    // ========== RECHERCHES COMBINÉES ==========
    List<Tables> findByStatutAndCapaciteGreaterThanEqual(StatutTable statut, Short capacite);
    
    // ========== REQUÊTES PERSONNALISÉES ==========
    @Query("SELECT t.statut, COUNT(t) FROM Tables t GROUP BY t.statut")
    List<Object[]> countTablesByStatut();
    
    @Query("SELECT COUNT(t) FROM Tables t WHERE t.statut = :statut")
    long countByStatut(@Param("statut") StatutTable statut);
    
    @Modifying
    @Transactional
    @Query("UPDATE Tables t SET t.statut = :statut WHERE t.idTables = :id")
    int updateStatut(@Param("id") Integer id, @Param("statut") StatutTable statut);
    
    @Query("SELECT COALESCE(SUM(t.capacite), 0) FROM Tables t")
    Integer getCapaciteTotale();
    
    @Query("SELECT COALESCE(SUM(t.capacite), 0) FROM Tables t WHERE t.statut = :statut")
    Integer getCapaciteDisponible(@Param("statut") StatutTable statut);
    
    // ✅ AJOUTER CETTE MÉTHODE
    @Query("SELECT t FROM Tables t WHERE t.statut = :statut AND t.capacite >= :capacite ORDER BY t.numeroTable")
    List<Tables> findTablesDisponibles(@Param("statut") StatutTable statut, @Param("capacite") Short capacite);
}