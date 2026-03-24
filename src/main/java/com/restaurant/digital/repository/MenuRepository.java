package com.restaurant.digital.repository;

import com.restaurant.digital.model.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {
    List<Menu> findByActifTrue();
}