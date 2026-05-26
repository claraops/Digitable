package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.UtilisateurRequest;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.service.impl.UtilisateurServiceImpl;
import com.restaurant.digital.repository.UtilisateurRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurServiceImpl utilisateurService;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(@Valid @RequestBody UtilisateurRequest request) {
        return new ResponseEntity<>(utilisateurService.inscrire(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        boolean ok = utilisateurService.verifierMotDePasse(email, password);
        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Identifiants incorrects"));
        }
        
        // ✅ Récupérer l'utilisateur complet
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // ✅ Retourner toutes les informations nécessaires
        Map<String, Object> response = new HashMap<>();
        response.put("idUser", user.getIdUser());
        response.put("nom", user.getNom());
        response.put("prenom", user.getPrenom());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().toString());
        response.put("langue", user.getLangue());
        response.put("telephone", user.getTelephone());
        
        return ResponseEntity.ok(response);
    }
}