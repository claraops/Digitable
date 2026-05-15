# Configuration d'API Mock pour Development

## 📝 Explication

Actuellement, l'application utilise une **API Mock** (données simulées) au lieu de se connecter à un vrai backend Spring Boot. Cela permet à l'app de fonctionner complètement sans serveur externe.

## 🔄 Pour basculer vers le vrai backend

### Option 1 : Lors du déploiement
1. Lancez votre serveur Spring Boot sur `http://localhost:8080`
2. Modifiez [src/services/api.js](src/services/api.js#L6):
   ```javascript
   const USE_MOCK_API = false; // Basculer à false
   ```

### Option 2 : Avec une variable d'environnement (recommandé)
1. Créez un fichier `.env` à la racine du projet :
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_USE_MOCK_API=false
   ```

2. Modifiez [src/services/api.js](src/services/api.js) pour utiliser la variable:
   ```javascript
   const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
   ```

## 🎯 Données de test (Mock API)

Le fichier [src/api/mockData.js](src/api/mockData.js) contient les données de test:

### Utilisateurs Test
- **Admin**: jean.dupont@example.com / password123
- **Client**: marie.martin@example.com / password456

### Ressources disponibles
- ✅ Plats (CRUD complet)
- ✅ Menus (CRUD complet)
- ✅ Tables (CRUD complet)
- ✅ Commandes (lecture)
- ✅ Avis (lecture)
- ✅ Factures (lecture)

## ⚙️ Comment fonctionne le Mock API

L'API utilise un **intercepteur Axios** qui :
1. Intercepte chaque requête HTTP
2. La redirige vers les données mock
3. Simule un délai réseau de 300ms pour plus de réalisme
4. Gère les opérations CRUD (Create, Read, Update, Delete)

## 📊 Endpoints mappés

```
GET/POST   /plats                 → Gestion des plats
PUT/DELETE /plats/:id             → Modification/suppression plat
GET/POST   /menus                 → Gestion des menus  
PUT/DELETE /menus/:id             → Modification/suppression menu
GET/POST   /tables                → Gestion des tables
PUT/DELETE /tables/:id            → Modification/suppression table
GET        /commandes             → Liste des commandes
GET        /avis                  → Liste des avis
GET        /factures              → Liste des factures
GET        /utilisateurs/email/:email → Authentification
```

## 🔗 Intégration avec votre backend

Quand vous êtes prêt à intégrer le vrai backend :

1. **Arrêtez le mock** : `const USE_MOCK_API = false`
2. **Assurez-vous que** votre backend Spring Boot écoute sur `http://localhost:8080/api/v1`
3. **Les services existants** (`platService.js`, `menuService.js`, etc.) continueront à fonctionner sans modification

## 🐛 Debugging

- Vérifiez la console du navigateur (F12) pour voir les appels `[MOCK API]`
- Les données sont mises en mémoire - elles se réinitialisent au rechargement de la page
- Pour une persistance, utilisez `localStorage` ou `IndexedDB`
