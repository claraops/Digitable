package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Integer> {
    
    // ========== RECHERCHES DE BASE ==========
    Optional<Facture> findByCommandeIdCommande(Integer idCommande);
    List<Facture> findByModePaiement(String modePaiement);
    List<Facture> findByDatePaiementBetween(LocalDateTime debut, LocalDateTime fin);
    boolean existsByCommandeIdCommande(Integer idCommande);
    void deleteByCommandeIdCommande(Integer idCommande);
    
    // ========== STATISTIQUES ==========
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f")
    BigDecimal chiffreAffairesTotal();
    
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    BigDecimal chiffreAffairesParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    @Query("SELECT COALESCE(AVG(f.montant), 0) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    BigDecimal ticketMoyenParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    @Query("SELECT f.modePaiement, COUNT(f), COALESCE(SUM(f.montant), 0) FROM Facture f GROUP BY f.modePaiement")
    List<Object[]> statistiquesParModePaiement();
    
    @Query("SELECT YEAR(f.datePaiement), MONTH(f.datePaiement), COUNT(f), SUM(f.montant) FROM Facture f GROUP BY YEAR(f.datePaiement), MONTH(f.datePaiement) ORDER BY YEAR(f.datePaiement) DESC, MONTH(f.datePaiement) DESC")
    List<Object[]> getStatistiquesMensuelles();
    
    @Query("SELECT f FROM Facture f WHERE DATE(f.datePaiement) = CURRENT_DATE")
    List<Facture> facturesDuJour();
    
    @Query("SELECT f FROM Facture f WHERE YEARWEEK(f.datePaiement) = YEARWEEK(CURRENT_DATE)")
    List<Facture> facturesDeLaSemaine();
    
    @Query("SELECT f FROM Facture f WHERE MONTH(f.datePaiement) = MONTH(CURRENT_DATE) AND YEAR(f.datePaiement) = YEAR(CURRENT_DATE)")
    List<Facture> facturesDuMois();
}