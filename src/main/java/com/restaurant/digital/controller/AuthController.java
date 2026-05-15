package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.UtilisateurRequest;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.service.impl.UtilisateurServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurServiceImpl utilisateurService;

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(@Valid @RequestBody UtilisateurRequest request) {
        return new ResponseEntity<>(utilisateurService.inscrire(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        boolean ok = utilisateurService.verifierMotDePasse(credentials.get("email"), credentials.get("password"));
        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Identifiants incorrects"));
        }
        // Ici vous pouvez générer un JWT ou retourner l'utilisateur
        return ResponseEntity.ok(Map.of("message", "Connexion réussie"));
    }
}

