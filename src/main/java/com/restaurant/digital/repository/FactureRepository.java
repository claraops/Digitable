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
    Optional<Facture> findByCommandeIdCommande(Integer idCommande);
    List<Facture> findByDatePaiementBetween(LocalDateTime debut, LocalDateTime fin);
    boolean existsByCommandeIdCommande(Integer idCommande);
    
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f")
    BigDecimal chiffreAffairesTotal();
    
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    BigDecimal chiffreAffairesParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
}