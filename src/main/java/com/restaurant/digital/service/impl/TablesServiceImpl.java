package com.restaurant.digital.service.impl;

import com.restaurant.digital.exception.ResourceNotFoundException;
import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.enums.StatutTable;
import com.restaurant.digital.repository.TablesRepository;
import com.restaurant.digital.service.interfaces.TablesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class TablesServiceImpl implements TablesService {
    
    private final TablesRepository tablesRepository;
    
    @Override
    public Tables creerTable(Tables table) {
        if (tablesRepository.existsByNumeroTable(table.getNumeroTable())) {
            throw new IllegalArgumentException("Une table avec ce numéro existe déjà");
        }
        table.setStatut(StatutTable.LIBRE);
        return tablesRepository.save(table);
    }
    
    @Override
    public Tables getTableById(Integer id) {
        return tablesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Table non trouvée avec l'id: " + id));
    }
    
    @Override
    public Tables getTableByNumero(Long numeroTable) {
        return tablesRepository.findByNumeroTable(numeroTable)
            .orElseThrow(() -> new ResourceNotFoundException("Table non trouvée avec le numéro: " + numeroTable));
    }
    
    @Override
    public List<Tables> getAllTables() {
        return tablesRepository.findAll();
    }
    
    @Override
    public Tables updateTable(Integer id, Tables tableDetails) {
        Tables table = getTableById(id);
        
        if (!table.getNumeroTable().equals(tableDetails.getNumeroTable()) &&
            tablesRepository.existsByNumeroTable(tableDetails.getNumeroTable())) {
            throw new IllegalArgumentException("Une table avec ce numéro existe déjà");
        }
        
        table.setNumeroTable(tableDetails.getNumeroTable());
        table.setCapacite(tableDetails.getCapacite());
        
        return tablesRepository.save(table);
    }
    
    @Override
    public void deleteTable(Integer id) {
        Tables table = getTableById(id);
        if (!table.getCommandes().isEmpty()) {
            throw new IllegalStateException("Impossible de supprimer une table avec des commandes associées");
        }
        tablesRepository.delete(table);
    }
    
    @Override
    public Tables changerStatut(Integer id, StatutTable nouveauStatut) {
        Tables table = getTableById(id);
        table.setStatut(nouveauStatut);
        return tablesRepository.save(table);
    }
    
    @Override
    public Tables libererTable(Integer id) {
        Tables table = getTableById(id);
        table.setStatut(StatutTable.LIBRE);
        return tablesRepository.save(table);
    }
    
    @Override
    public Tables occuperTable(Integer id) {
        Tables table = getTableById(id);
        if (table.getStatut() != StatutTable.LIBRE) {
            throw new IllegalStateException("Seules les tables libres peuvent être occupées");
        }
        table.setStatut(StatutTable.OCCUPEE);
        return tablesRepository.save(table);
    }
    
    @Override
    public Tables reserverTable(Integer id) {
        Tables table = getTableById(id);
        if (table.getStatut() != StatutTable.LIBRE) {
            throw new IllegalStateException("Seules les tables libres peuvent être réservées");
        }
        table.setStatut(StatutTable.RESERVEE);
        return tablesRepository.save(table);
    }
    
    @Override
    public Tables mettreANettoyer(Integer id) {
        Tables table = getTableById(id);
        table.setStatut(StatutTable.A_NETTOYER);
        return tablesRepository.save(table);
    }
    
    @Override
    public List<Tables> getTablesLibres() {
        return tablesRepository.findByStatut(StatutTable.LIBRE);
    }
    
    @Override
    public List<Tables> getTablesDisponibles(Short capacite) {
        return tablesRepository.findTablesDisponibles(StatutTable.LIBRE, capacite);
    }
    
    @Override
    public List<Tables> getTablesByStatut(StatutTable statut) {
        return tablesRepository.findByStatut(statut);
    }
    
    @Override
    public List<Tables> getTablesByCapacite(Short capacite) {
        return tablesRepository.findByCapaciteGreaterThanEqual(capacite);
    }
    
    @Override
    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        
        // Utilisation correcte de la méthode countTablesByStatut()
        List<Object[]> compteurs = tablesRepository.countTablesByStatut();
        
        for (Object[] row : compteurs) {
            StatutTable statut = (StatutTable) row[0];
            Long count = (Long) row[1];
            String key = "nb_" + statut.toString().toLowerCase();
            stats.put(key, count);
        }
        
        stats.put("capacite_totale", tablesRepository.getCapaciteTotale());
        stats.put("capacite_disponible", tablesRepository.getCapaciteDisponible(StatutTable.LIBRE));
        stats.put("total_tables", tablesRepository.count());
        
        return stats;
    }
    
    @Override
    public Integer getCapaciteRestante() {
        return tablesRepository.getCapaciteDisponible(StatutTable.LIBRE);
    }
    
    @Override
    public boolean isTableDisponible(Integer id) {
        Tables table = getTableById(id);
        return table.getStatut() == StatutTable.LIBRE;
    }
}