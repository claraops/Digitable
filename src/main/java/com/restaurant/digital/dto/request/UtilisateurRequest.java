package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Requête d'inscription d'un utilisateur")
public class UtilisateurRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]{2,50}$", message = "Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets")
    @Schema(description = "Nom de famille", example = "Dupont")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]{2,50}$", message = "Le prénom ne doit contenir que des lettres, espaces, apostrophes et tirets")
    @Schema(description = "Prénom", example = "Jean")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Schema(description = "Email de l'utilisateur", example = "jean.dupont@email.com")
    private String email;

    @Schema(description = "Langue préférée", example = "fr")
    private String langue;

    @Schema(description = "Rôle utilisateur", example = "CLIENT")
    private String role;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$", 
             message = "Le mot de passe doit contenir au moins une lettre et un chiffre")
    private String password;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^(\\+33|0)[1-9]\\d{8}$", 
             message = "Numéro de téléphone invalide (ex: 0612345678 ou +33612345678)")
    @Schema(description = "Numéro de téléphone", example = "0612345678")
    private String telephone;
    
    
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getLangue() { return langue; }
    public String getTelephone() { return telephone; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}