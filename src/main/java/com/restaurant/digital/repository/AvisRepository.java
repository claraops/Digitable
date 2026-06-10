package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Integer> {
    List<Avis> findByCommande_IdCommande(Integer idCommande);

    @Query("SELECT a FROM Avis a WHERE a.commande.idCommande IN " +
           "(SELECT c.commande.idCommande FROM Contenir c WHERE c.plat.idPlat = :platId)")
    List<Avis> findByPlatId(@Param("platId") Integer platId);
}