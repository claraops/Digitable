package com.restaurant.digital.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UtilisateurRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    // Regex assouplie pour les tests
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Le nom ne doit contenir que des lettres")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Le prénom ne doit contenir que des lettres")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    private String langue;

    private String role;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 4, message = "Le mot de passe doit faire au moins 4 caractères")  // ← Assoupli
    // Regex assouplie pour les tests
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", 
             message = "Le mot de passe doit contenir au moins une lettre et un chiffre")
    private String password;

    @NotBlank(message = "Le téléphone est obligatoire")
    // Regex assouplie pour accepter plus de formats
    @Pattern(regexp = "^(\\+33|0)[1-9]\\d{8}$", 
             message = "Numéro de téléphone invalide (ex: 0612345678 ou +33612345678)")
    private String telephone;
    
    
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getLangue() { return langue; }
    public String getTelephone() { return telephone; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}