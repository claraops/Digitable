package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.repository.PlatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/plats")
@RequiredArgsConstructor
public class PlatController {

    private final PlatRepository platRepository;

    @Operation(summary = "Créer un plat", description = "Ajoute un nouveau plat")
    @ApiResponse(responseCode = "201", description = "Plat créé")
    @PostMapping
    public ResponseEntity<Plat> creerPlat(@RequestBody Plat plat) {
        return new ResponseEntity<>(platRepository.save(plat), HttpStatus.CREATED);
    }

    @Operation(summary = "Récupérer tous les plats", description = "Retourne la liste complète des plats")
    @GetMapping
    public ResponseEntity<List<Plat>> getAllPlats() {
        return ResponseEntity.ok(platRepository.findAll());
    }

    @Operation(summary = "Récupérer les plats disponibles", description = "Retourne la liste des plats disponibles")
    @GetMapping("/disponibles")
    public ResponseEntity<List<Plat>> getPlatsDisponibles() {
        return ResponseEntity.ok(platRepository.findByDisponibiliteTrue());
    }
    
    

    @Operation(summary = "Récupérer un plat par ID", description = "Retourne un plat selon son identifiant")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Plat trouvé"),
        @ApiResponse(responseCode = "404", description = "Plat non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Plat> getPlatById(@PathVariable @Parameter(description = "ID du plat") Integer id) {
        return platRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}