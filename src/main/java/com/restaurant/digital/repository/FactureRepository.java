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
    
    /**
     * Trouver une facture par commande
     */
    Optional<Facture> findByCommandeIdCommande(Integer idCommande);
    
    /**
     * Trouver les factures par mode de paiement
     */
    List<Facture> findByModePaiement(String modePaiement);
    
    /**
     * Trouver les factures entre deux dates
     */
    List<Facture> findByDatePaiementBetween(LocalDateTime debut, LocalDateTime fin);
    
    // ========== RECHERCHES PAR UTILISATEUR ==========
    
    /**
     * Trouver toutes les factures d'un utilisateur
     */
    @Query("SELECT f FROM Facture f WHERE f.commande.utilisateur.idUser = :userId")
    List<Facture> findByUtilisateurId(@Param("userId") Integer userId);
    
    // ========== RECHERCHES PAR MONTANT ==========
    
    /**
     * Trouver les factures avec montant supérieur à
     */
    List<Facture> findByMontantGreaterThanEqual(BigDecimal montant);
    
    /**
     * Trouver les factures avec montant inférieur à
     */
    List<Facture> findByMontantLessThanEqual(BigDecimal montant);
    
    // ========== STATISTIQUES ET RAPPORTS ==========
    
    /**
     * Chiffre d'affaires total
     */
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f")
    BigDecimal chiffreAffairesTotal();
    
    /**
     * Chiffre d'affaires par période
     */
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    BigDecimal chiffreAffairesParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    /**
     * Nombre de factures par période
     */
    @Query("SELECT COUNT(f) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    Long nombreFacturesParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    /**
     * Ticket moyen par période
     */
    @Query("SELECT COALESCE(AVG(f.montant), 0) FROM Facture f WHERE f.datePaiement BETWEEN :debut AND :fin")
    BigDecimal ticketMoyenParPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    /**
     * Chiffre d'affaires par jour pour une période
     */
    @Query("SELECT DATE(f.datePaiement), COALESCE(SUM(f.montant), 0) " +
           "FROM Facture f " +
           "WHERE f.datePaiement BETWEEN :debut AND :fin " +
           "GROUP BY DATE(f.datePaiement) " +
           "ORDER BY DATE(f.datePaiement)")
    List<Object[]> chiffreAffairesParJour(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    /**
     * Statistiques par mode de paiement
     */
    @Query("SELECT f.modePaiement, COUNT(f), COALESCE(SUM(f.montant), 0) " +
           "FROM Facture f " +
           "GROUP BY f.modePaiement " +
           "ORDER BY SUM(f.montant) DESC")
    List<Object[]> statistiquesParModePaiement();
    
    /**
     * Statistiques mensuelles (CORRIGÉ avec @Query)
     */
    @Query("SELECT YEAR(f.datePaiement), MONTH(f.datePaiement), COUNT(f), SUM(f.montant) " +
           "FROM Facture f " +
           "GROUP BY YEAR(f.datePaiement), MONTH(f.datePaiement) " +
           "ORDER BY YEAR(f.datePaiement) DESC, MONTH(f.datePaiement) DESC")
    List<Object[]> getStatistiquesMensuelles();
    
    // ========== FACTURES DU JOUR/SEMAINE/MOIS ==========
    
    /**
     * Factures du jour
     */
    @Query("SELECT f FROM Facture f WHERE DATE(f.datePaiement) = CURRENT_DATE")
    List<Facture> facturesDuJour();
    
    /**
     * Factures de la semaine
     */
    @Query("SELECT f FROM Facture f WHERE YEARWEEK(f.datePaiement) = YEARWEEK(CURRENT_DATE)")
    List<Facture> facturesDeLaSemaine();
    
    /**
     * Factures du mois
     */
    @Query("SELECT f FROM Facture f WHERE MONTH(f.datePaiement) = MONTH(CURRENT_DATE) " +
           "AND YEAR(f.datePaiement) = YEAR(CURRENT_DATE)")
    List<Facture> facturesDuMois();
    
    // ========== VÉRIFICATIONS ==========
    
    /**
     * Vérifier si une commande a une facture
     */
    boolean existsByCommandeIdCommande(Integer idCommande);
    
    /**
     * Supprimer les factures d'une commande
     */
    void deleteByCommandeIdCommande(Integer idCommande);
    
    // ========== DERNIÈRES FACTURES ==========
    
    /**
     * Les 10 dernières factures
     */
    List<Facture> findTop10ByOrderByDatePaiementDesc();
}