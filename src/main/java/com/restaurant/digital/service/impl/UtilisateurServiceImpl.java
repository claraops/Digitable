package com.restaurant.digital.service.impl;

import com.restaurant.digital.dto.request.UtilisateurRequest;
import com.restaurant.digital.model.entity.Utilisateur;
import com.restaurant.digital.model.enums.RoleUtilisateur;
import com.restaurant.digital.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public Utilisateur inscrire(UtilisateurRequest request) {
        // Vérifier si l'email existe déjà
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setLangue(request.getLangue());
        utilisateur.setTelephone(request.getTelephone());

        // Définir le rôle
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            utilisateur.setRole(RoleUtilisateur.ADMIN);
        } else {
            utilisateur.setRole(RoleUtilisateur.CLIENT);
        }

        // 🔐 Hachage du mot de passe
        utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));

        return utilisateurRepository.save(utilisateur);
    }

    public boolean verifierMotDePasse(String email, String rawPassword) {
        return utilisateurRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }
}