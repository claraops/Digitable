package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Contenir;
import com.restaurant.digital.model.entity.ContenirId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContenirRepository extends JpaRepository<Contenir, ContenirId> {
}