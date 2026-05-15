package com.restaurant.digital.config;

public class SecurityFilter {
	// Méthode simple pour supprimer les balises HTML/script
    public static String cleanInput(String input) {
        if (input == null) return "";
        
        // Supprimer tout ce qui ressemble à une balise HTML
        String cleaned = input.replaceAll("<[^>]*>", "");
        
        // Supprimer les mots-clés dangereux
        cleaned = cleaned.replaceAll("(?i)javascript:", "");
        cleaned = cleaned.replaceAll("(?i)onclick", "");
        cleaned = cleaned.replaceAll("(?i)onalert", "");
        cleaned = cleaned.replaceAll("(?i)alert\\(", "");
        
        return cleaned;
    }
    
    // Méthode pour valider un champ du menu
    public static boolean isValidMenuField(String fieldName, String value) {
        if (value == null || value.isEmpty()) return false;
        
        // Vérifier les patterns dangereux
        String[] dangerous = {"<script", "javascript:", "onclick", "alert(", "document."};
        
        String lowerValue = value.toLowerCase();
        for (String danger : dangerous) {
            if (lowerValue.contains(danger)) {
                System.out.println("Champ '" + fieldName + "' contient du contenu dangereux !");
                return false;
            }
        }
        return true;
    }
    
    // Exemple d'utilisation dans votre application de menu digital
    public static void main(String[] args) {
        // Simuler la soumission d'un nouveau plat
        String nouveauPlat = "<script>alert('Pizza gratuite!');</script>Pizza au thon";
        String prix = "14.50";
        
        String plat1 = "<script>javascript : kebab </script>";
        String prix1 = "17$"; 
        
        //Nettoyer avant d'enregistrer dans la base de données
        String platNettoye = cleanInput(plat1);
        
        if (isValidMenuField("nom_plat", plat1)) {
            System.out.println("Plat ajouté: " + platNettoye);
            System.out.println("Prix: " + prix + "€");
        } else {
            System.out.println("Plat refusé - Contenu dangereux détecté");
            System.out.println("Version nettoyée: " + platNettoye);
        }
    }
}



