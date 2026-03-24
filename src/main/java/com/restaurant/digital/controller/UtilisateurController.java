package com.restaurant.digital.controller;

import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    // Créer un utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> creerUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurRepository.findAll());
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Integer id) {
        return utilisateurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Integer id,
            @RequestBody Utilisateur utilisateurDetails) {
        
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateur.setNom(utilisateurDetails.getNom());
                    utilisateur.setPrenom(utilisateurDetails.getPrenom());
                    utilisateur.setEmail(utilisateurDetails.getEmail());
                    utilisateur.setLangue(utilisateurDetails.getLangue());
                    utilisateur.setRole(utilisateurDetails.getRole());
                    return ResponseEntity.ok(utilisateurRepository.save(utilisateur));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Integer id) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateurRepository.delete(utilisateur);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer un utilisateur par email
    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        return utilisateurRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}