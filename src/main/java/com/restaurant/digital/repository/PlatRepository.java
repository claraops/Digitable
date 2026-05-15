package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Plat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlatRepository extends JpaRepository<Plat, Integer> {
    List<Plat> findByDisponibiliteTrue();
    List<Plat> findByDisponibiliteTrueAndMenusActifTrue();
}