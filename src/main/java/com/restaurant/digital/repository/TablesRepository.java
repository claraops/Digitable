package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.enums.StatutTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Integer> {
    Optional<Tables> findByNumeroTable(Long numeroTable);
    List<Tables> findByStatut(StatutTable statut);
    List<Tables> findByCapaciteGreaterThanEqual(Short capacite);
    boolean existsByNumeroTable(Long numeroTable);
    
    @Query("SELECT t.statut, COUNT(t) FROM Tables t GROUP BY t.statut")
    List<Object[]> countTablesByStatut();
    
    @Query("SELECT SUM(t.capacite) FROM Tables t")
    Integer getCapaciteTotale();
    
    @Query("SELECT SUM(t.capacite) FROM Tables t WHERE t.statut = :statut")
    Integer getCapaciteDisponible(@Param("statut") StatutTable statut);
}