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

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
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
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
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