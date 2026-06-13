package com.restaurant.digital.controller;

import com.restaurant.digital.dto.request.LoginRequest;
import com.restaurant.digital.dto.request.UtilisateurRequest;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.service.impl.UtilisateurServiceImpl;
import com.restaurant.digital.repository.UtilisateurRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "Inscrire un utilisateur", description = "Crée un nouveau compte utilisateur")
    @ApiResponse(responseCode = "201", description = "Utilisateur inscrit avec succès")
    public ResponseEntity<Utilisateur> register(@Valid @RequestBody UtilisateurRequest request) {
        return new ResponseEntity<>(utilisateurService.inscrire(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Connecter un utilisateur", description = "Authentifie un utilisateur et retourne ses informations")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Connexion réussie"),
        @ApiResponse(responseCode = "401", description = "Identifiants incorrects")
    })
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        boolean ok = utilisateurService.verifierMotDePasse(request.getEmail(), request.getPassword());
        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Identifiants incorrects"));
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
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