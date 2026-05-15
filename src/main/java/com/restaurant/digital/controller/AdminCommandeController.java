package com.restaurant.digital.controller;

import com.restaurant.digital.dto.response.CommandeResponse;
import com.restaurant.digital.model.enums.StatutCommande;
import com.restaurant.digital.service.interfaces.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/commandes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCommandeController {

    private final CommandeService commandeService;

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CommandeResponse>> getCommandesByStatut(@PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.getAllCommandesByStatut(statut));
    }
}