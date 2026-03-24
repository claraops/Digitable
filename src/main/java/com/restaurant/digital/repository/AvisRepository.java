package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Integer> {
}