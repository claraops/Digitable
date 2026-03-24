package com.restaurant.digital.service.interfaces;

import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.enums.StatutTable;
import java.util.List;
import java.util.Map;

public interface TablesService {
    
    // CRUD de base
    Tables creerTable(Tables table);
    Tables getTableById(Integer id);
    Tables getTableByNumero(Long numeroTable);
    List<Tables> getAllTables();
    Tables updateTable(Integer id, Tables table);
    void deleteTable(Integer id);
    
    // Gestion des statuts
    Tables changerStatut(Integer id, StatutTable nouveauStatut);
    Tables libererTable(Integer id);
    Tables occuperTable(Integer id);
    Tables reserverTable(Integer id);
    Tables mettreANettoyer(Integer id);
    
    // Recherches
    List<Tables> getTablesLibres();
    List<Tables> getTablesDisponibles(Short capacite);
    List<Tables> getTablesByStatut(StatutTable statut);
    List<Tables> getTablesByCapacite(Short capacite);
    
    // Statistiques
    Map<String, Object> getStatistiques();
    Integer getCapaciteRestante();
    boolean isTableDisponible(Integer id);
}