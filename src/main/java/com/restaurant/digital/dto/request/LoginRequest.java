package com.restaurant.digital.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Requête de connexion utilisateur")
public class LoginRequest {

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Schema(description = "Email de l'utilisateur", example = "jean.dupont@email.com")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Schema(description = "Mot de passe", example = "monPass123")
    private String password;
}
