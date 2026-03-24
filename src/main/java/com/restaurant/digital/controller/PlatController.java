package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Plat;
import com.restaurant.digital.repository.PlatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlatController {

    private final PlatRepository platRepository;

    @PostMapping
    public ResponseEntity<Plat> creerPlat(@RequestBody Plat plat) {
        return new ResponseEntity<>(platRepository.save(plat), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Plat>> getAllPlats() {
        return ResponseEntity.ok(platRepository.findAll());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Plat>> getPlatsDisponibles() {
        return ResponseEntity.ok(platRepository.findByDisponibiliteTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plat> getPlatById(@PathVariable Integer id) {
        return platRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}