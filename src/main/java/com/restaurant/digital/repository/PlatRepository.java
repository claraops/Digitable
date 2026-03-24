package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Plat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlatRepository extends JpaRepository<Plat, Integer> {
    List<Plat> findByDisponibiliteTrue();
    
    @Query("SELECT p FROM Plat p WHERE p.nomPlat LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Plat> rechercherPlats(String keyword);
}