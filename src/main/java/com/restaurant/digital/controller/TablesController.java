package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Tables;
import com.restaurant.digital.model.enums.StatutTable;
import com.restaurant.digital.repository.TablesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor 
public class TablesController {

    private final TablesRepository tablesRepository;

    /**
     * Créer une nouvelle table
     * POST /api/v1/tables
     */
    @PostMapping
    public ResponseEntity<Tables> creerTable(@RequestBody Tables table) {
        // Vérifier si le numéro de table existe déjà
        if (tablesRepository.existsByNumeroTable(table.getNumeroTable())) {
            return ResponseEntity.badRequest().build();
        }
        table.setStatut(StatutTable.LIBRE);
        Tables savedTable = tablesRepository.save(table);
        return new ResponseEntity<>(savedTable, HttpStatus.CREATED);
    }

    /**
     * Récupérer toutes les tables
     * GET /api/v1/tables
     */
    @GetMapping
    public ResponseEntity<List<Tables>> getAllTables() {
        List<Tables> tables = tablesRepository.findAll();
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer une table par son ID
     * GET /api/v1/tables/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer une table par son numéro
     * GET /api/v1/tables/numero/{numero}
     */
    @GetMapping("/numero/{numero}")
    public ResponseEntity<Tables> getTableByNumero(@PathVariable Long numero) {
        return tablesRepository.findByNumeroTable(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Mettre à jour une table
     * PUT /api/v1/tables/{id}
     */
    @PutMapping("/{id}")
   /* public ResponseEntity<Tables> updateTable(@PathVariable Integer id, @RequestBody Tables tableDetails) {
        return tablesRepository.findById(id)
                .map(table -> {
                    // Vérifier si le nouveau numéro n'est pas déjà pris
                    if (!table.getNumeroTable().equals(tableDetails.getNumeroTable()) &&
                        tablesRepository.existsByNumeroTable(tableDetails.getNumeroTable())) {
                        return ResponseEntity.<Tables>badRequest().build();
                    }
                    table.setNumeroTable(tableDetails.getNumeroTable());
                    table.setCapacite(tableDetails.getCapacite());
                    // Ne pas modifier le statut ici
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }*/

    /**
     * Supprimer une table
     * DELETE /api/v1/tables/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(table -> {
                    tablesRepository.delete(table);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Changer le statut d'une table
     * PATCH /api/v1/tables/{id}/statut?statut=OCCUPEE
     */
    @PatchMapping("/{id}/statut")
    public ResponseEntity<Tables> changerStatut(@PathVariable Integer id, @RequestParam StatutTable statut) {
        return tablesRepository.findById(id)
                .map(table -> {
                    table.setStatut(statut);
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Occuper une table
     * POST /api/v1/tables/{id}/occuper
     */
   /* @PostMapping("/{id}/occuper")
    public ResponseEntity<Tables> occuperTable(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(table -> {
                    if (table.getStatut() != StatutTable.LIBRE) {
                        return ResponseEntity.<Tables>badRequest().build();
                    }
                    table.setStatut(StatutTable.OCCUPEE);
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }*/

    /**
     * Libérer une table
     * POST /api/v1/tables/{id}/liberer
     */
    @PostMapping("/{id}/liberer")
    public ResponseEntity<Tables> libererTable(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(table -> {
                    table.setStatut(StatutTable.LIBRE);
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Réserver une table
     * POST /api/v1/tables/{id}/reserver
     */
   /* @PostMapping("/{id}/reserver")
    public ResponseEntity<Tables> reserverTable(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(table -> {
                    if (table.getStatut() != StatutTable.LIBRE) {
                        return ResponseEntity.<Tables>badRequest().build();
                    }
                    table.setStatut(StatutTable.RESERVEE);
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }*/

    /**
     * Mettre une table à nettoyer
     * POST /api/v1/tables/{id}/nettoyer
     */
    @PostMapping("/{id}/nettoyer")
    public ResponseEntity<Tables> mettreANettoyer(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(table -> {
                    table.setStatut(StatutTable.A_NETTOYER);
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer les tables par statut
     * GET /api/v1/tables/statut/{statut}
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Tables>> getTablesByStatut(@PathVariable StatutTable statut) {
        List<Tables> tables = tablesRepository.findByStatut(statut);
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer les tables libres
     * GET /api/v1/tables/libres
     */
    @GetMapping("/libres")
    public ResponseEntity<List<Tables>> getTablesLibres() {
        List<Tables> tables = tablesRepository.findByStatut(StatutTable.LIBRE);
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer les tables par capacité minimum
     * GET /api/v1/tables/capacite/{capacite}
     */
    @GetMapping("/capacite/{capacite}")
    public ResponseEntity<List<Tables>> getTablesByCapacite(@PathVariable Short capacite) {
        List<Tables> tables = tablesRepository.findByCapaciteGreaterThanEqual(capacite);
        return ResponseEntity.ok(tables);
    }

    /**
     * Trouver les tables disponibles pour une capacité donnée
     * GET /api/v1/tables/disponibles?capacite=4
     */
    @GetMapping("/disponibles")
    public ResponseEntity<List<Tables>> getTablesDisponibles(@RequestParam Short capacite) {
        List<Tables> tables = tablesRepository.findTablesDisponibles(StatutTable.LIBRE, capacite);
        return ResponseEntity.ok(tables);
    }

    /**
     * Statistiques des tables
     * GET /api/v1/tables/statistiques
     */
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        
        // Nombre de tables par statut
        List<Object[]> compteurs = tablesRepository.countTablesByStatut();
        for (Object[] row : compteurs) {
            StatutTable statut = (StatutTable) row[0];
            Long count = (Long) row[1];
            stats.put("nb_" + statut.toString().toLowerCase(), count);
        }
        
        // Capacité totale
        Integer capaciteTotale = tablesRepository.getCapaciteTotale();
        stats.put("capacite_totale", capaciteTotale != null ? capaciteTotale : 0);
        
        // Capacité disponible
        Integer capaciteDisponible = tablesRepository.getCapaciteDisponible(StatutTable.LIBRE);
        stats.put("capacite_disponible", capaciteDisponible != null ? capaciteDisponible : 0);
        
        // Nombre total de tables
        stats.put("total_tables", tablesRepository.count());
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Vérifier si un numéro de table existe
     * GET /api/v1/tables/existe?numero=5
     */
    @GetMapping("/existe")
    public ResponseEntity<Map<String, Boolean>> existeTable(@RequestParam Long numero) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("existe", tablesRepository.existsByNumeroTable(numero));
        return ResponseEntity.ok(response);
    }
}