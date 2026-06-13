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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor 
public class TablesController {

    private final TablesRepository tablesRepository;

    /**
     * Créer une nouvelle table
     * POST /api/v1/tables
     */
    @Operation(summary = "Créer une table", description = "Ajoute une nouvelle table")
    @ApiResponse(responseCode = "201", description = "Table créée")
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
    @Operation(summary = "Récupérer toutes les tables", description = "Retourne la liste complète des tables")
    @GetMapping
    public ResponseEntity<List<Tables>> getAllTables() {
        List<Tables> tables = tablesRepository.findAll();
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer une table par son ID
     * GET /api/v1/tables/{id}
     */
    @Operation(summary = "Récupérer une table par ID", description = "Retourne une table selon son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Table trouvée"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable @Parameter(description = "ID de la table") Integer id) {
        return tablesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer une table par son numéro
     * GET /api/v1/tables/numero/{numero}
     */
    @Operation(summary = "Récupérer une table par numéro", description = "Retourne une table selon son numéro")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Table trouvée"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @GetMapping("/numero/{numero}")
    public ResponseEntity<Tables> getTableByNumero(@PathVariable @Parameter(description = "Numéro de la table") Long numero) {
        return tablesRepository.findByNumeroTable(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Mettre à jour une table
     * PUT /api/v1/tables/{id}
     */
    @Operation(summary = "Mettre à jour une table", description = "Met à jour les informations d'une table")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Table mise à jour"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTable(@PathVariable @Parameter(description = "ID de la table") Integer id, @RequestBody Tables tableDetails) {
        return tablesRepository.findById(id)
                .map(table -> {
                    if (!table.getNumeroTable().equals(tableDetails.getNumeroTable()) &&
                        tablesRepository.existsByNumeroTable(tableDetails.getNumeroTable())) {
                        return ResponseEntity.badRequest().build();
                    }
                    table.setNumeroTable(tableDetails.getNumeroTable());
                    table.setCapacite(tableDetails.getCapacite());
                    table.setStatut(tableDetails.getStatut());
                    return ResponseEntity.ok(tablesRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Supprimer une table
     * DELETE /api/v1/tables/{id}
     */
    @Operation(summary = "Supprimer une table", description = "Supprime une table par son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Table supprimée"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable @Parameter(description = "ID de la table") Integer id) {
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
    @Operation(summary = "Changer le statut d'une table", description = "Modifie le statut d'une table")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Statut modifié"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @PatchMapping("/{id}/statut")
    public ResponseEntity<Tables> changerStatut(@PathVariable @Parameter(description = "ID de la table") Integer id, @RequestParam @Parameter(description = "Nouveau statut") StatutTable statut) {
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
    @Operation(summary = "Libérer une table", description = "Passe le statut de la table à LIBRE")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Table libérée"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @PostMapping("/{id}/liberer")
    public ResponseEntity<Tables> libererTable(@PathVariable @Parameter(description = "ID de la table") Integer id) {
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
    @Operation(summary = "Mettre une table à nettoyer", description = "Passe le statut de la table à A_NETTOYER")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Table mise à nettoyer"),
        @ApiResponse(responseCode = "404", description = "Table non trouvée")
    })
    @PostMapping("/{id}/nettoyer")
    public ResponseEntity<Tables> mettreANettoyer(@PathVariable @Parameter(description = "ID de la table") Integer id) {
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
    @Operation(summary = "Récupérer les tables par statut", description = "Retourne les tables filtrées par statut")
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Tables>> getTablesByStatut(@PathVariable @Parameter(description = "Statut des tables") StatutTable statut) {
        List<Tables> tables = tablesRepository.findByStatut(statut);
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer les tables libres
     * GET /api/v1/tables/libres
     */
    @Operation(summary = "Récupérer les tables libres", description = "Retourne la liste des tables libres")
    @GetMapping("/libres")
    public ResponseEntity<List<Tables>> getTablesLibres() {
        List<Tables> tables = tablesRepository.findByStatut(StatutTable.LIBRE);
        return ResponseEntity.ok(tables);
    }

    /**
     * Récupérer les tables par capacité minimum
     * GET /api/v1/tables/capacite/{capacite}
     */
    @Operation(summary = "Récupérer les tables par capacité", description = "Retourne les tables ayant une capacité minimum")
    @GetMapping("/capacite/{capacite}")
    public ResponseEntity<List<Tables>> getTablesByCapacite(@PathVariable @Parameter(description = "Capacité minimum") Short capacite) {
        List<Tables> tables = tablesRepository.findByCapaciteGreaterThanEqual(capacite);
        return ResponseEntity.ok(tables);
    }

    /**
     * Trouver les tables disponibles pour une capacité donnée
     * GET /api/v1/tables/disponibles?capacite=4
     */
    @Operation(summary = "Trouver des tables disponibles", description = "Retourne les tables disponibles pour une capacité donnée")
    @GetMapping("/disponibles")
    public ResponseEntity<List<Tables>> getTablesDisponibles(@RequestParam @Parameter(description = "Capacité requise") Short capacite) {
        List<Tables> tables = tablesRepository.findTablesDisponibles(StatutTable.LIBRE, capacite);
        return ResponseEntity.ok(tables);
    }

    /**
     * Statistiques des tables
     * GET /api/v1/tables/statistiques
     */
    @Operation(summary = "Statistiques des tables", description = "Retourne les statistiques des tables")
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
    @Operation(summary = "Vérifier l'existence d'une table", description = "Vérifie si un numéro de table existe déjà")
    @GetMapping("/existe")
    public ResponseEntity<Map<String, Boolean>> existeTable(@RequestParam @Parameter(description = "Numéro de la table") Long numero) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("existe", tablesRepository.existsByNumeroTable(numero));
        return ResponseEntity.ok(response);
    }
    

}