package com.restaurant.digital.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
// ✅ CHANGEMENT IMPORTANT : Ajouter /api/v1
@RequestMapping("/images")
public class ImageController {

    private final Path uploadDir;

    public ImageController() throws IOException {
        String userHome = System.getProperty("user.home");
        this.uploadDir = Paths.get(userHome, "restaurant-uploads");
        
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            System.out.println("✅ Dossier créé: " + uploadDir.toAbsolutePath());
        }
    }

    @Operation(summary = "Uploader une image", description = "Télécharge une image et retourne son nom et son URL")
    @ApiResponse(responseCode = "200", description = "Image téléchargée avec succès")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") @Parameter(description = "Fichier image à télécharger") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String fileName = System.currentTimeMillis() + extension;
            
            Path destination = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("✅ Image sauvegardée: " + destination.toAbsolutePath());

            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);  // ← AJOUTER CECI
            response.put("url", "/api/v1/images/" + fileName);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @Operation(summary = "Récupérer une image", description = "Retourne une image par son nom de fichier")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Image trouvée"),
        @ApiResponse(responseCode = "404", description = "Image non trouvée")
    })
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable @Parameter(description = "Nom du fichier image") String filename) {
        try {
            Path filePath = uploadDir.resolve(filename);
            System.out.println("🔍 Recherche: " + filePath.toAbsolutePath());
            
            if (!Files.exists(filePath)) {
                System.out.println("❌ Fichier non trouvé: " + filename);
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "image/jpeg";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Lister les images", description = "Retourne la liste des images téléchargées")
    @GetMapping
    public ResponseEntity<Map<String, Object>> listImages() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("uploadDir", uploadDir.toAbsolutePath().toString());
        
        if (Files.exists(uploadDir)) {
            try {
                java.util.List<String> files = Files.list(uploadDir)
                    .map(p -> p.getFileName().toString())
                    .toList();
                response.put("files", files);
                response.put("count", files.size());
            } catch (IOException e) {
                response.put("error", e.getMessage());
            }
        }
        
        return ResponseEntity.ok(response);
    }
}