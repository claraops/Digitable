// utils/imageUtils.js
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getImageUrl = (imagePath) => {
  // Si pas d'image, retourner null
  if (!imagePath) return null;
  
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si l'image est dans le dossier uploads, construire l'URL complète
  // Les images stockées sont juste des noms de fichiers (ex: 1779537474148.jpg)
  return `${BACKEND_URL}/api/v1/images/${imagePath}`;
};

    
/*utils/imageUtils.js
import API_URL from '../config';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si c'est une URL complète
  if (imagePath.startsWith('http')) return imagePath;
  
  // Si l'image est déjà au format avec timestamp (ex: 1716462000000_plat.jpg)
  if (imagePath.includes('_') || /^\d+_.+$/.test(imagePath)) {
    return `${API_URL}/api/v1/images/${imagePath}`;
  }
  
  // Pour les anciennes images (pizza.jpg, menu.jpg) - elles n'existent pas sur le serveur
  // Donc on retourne un placeholder
  console.warn(`Image non trouvée sur le serveur: ${imagePath}`);
  return `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(imagePath)}`;
};*/