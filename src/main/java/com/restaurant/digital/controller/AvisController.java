package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Avis;
import com.restaurant.digital.repository.AvisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvisController {

    private final AvisRepository avisRepository;

    @PostMapping
    public ResponseEntity<Avis> creerAvis(@RequestBody Avis avis) {
        avis.setDateAvis(java.time.LocalDateTime.now());
        return new ResponseEntity<>(avisRepository.save(avis), HttpStatus.CREATED);
    }
}