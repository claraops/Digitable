# 📋 Couverture Complète API Mock

## ✅ Tous les Endpoints Implémentés

### 👥 UTILISATEURS
```javascript
GET    /utilisateurs/email/:email  ✅ Authentification
POST   /utilisateurs               ✅ Créer utilisateur
GET    /utilisateurs/:id           ✅ Récupérer utilisateur
PUT    /utilisateurs/:id           ✅ Modifier utilisateur
DELETE /utilisateurs/:id           ✅ Supprimer utilisateur
```

### 🍽️ PLATS
```javascript
GET    /plats                      ✅ Lister tous
GET    /plats/disponibles          ✅ Lister seulement actifs
GET    /plats/:id                  ✅ Détails d'un plat
POST   /plats                      ✅ Créer plat
PUT    /plats/:id                  ✅ Modifier plat
DELETE /plats/:id                  ✅ Supprimer plat
```

### 🔖 MENUS
```javascript
GET    /menus                      ✅ Lister tous
GET    /menus/actifs               ✅ Lister seulement actifs
GET    /menus/:id                  ✅ Détails menu
GET    /menus/:id/plats            ✅ Plats d'un menu
POST   /menus                      ✅ Créer menu
POST   /menus/:id/plats/:platId    ✅ Ajouter plat au menu
PUT    /menus/:id                  ✅ Modifier menu
DELETE /menus/:id                  ✅ Supprimer menu
DELETE /menus/:id/plats/:platId    ✅ Retirer plat du menu
```

### 📍 TABLES
```javascript
GET    /tables                     ✅ Lister toutes
GET    /tables/disponibles         ✅ Lister libres seulement
GET    /tables/statistiques        ✅ Stats (total, libres, occupées)
GET    /tables/:id                 ✅ Détails table
POST   /tables                     ✅ Créer table
PATCH  /tables/:id/statut          ✅ Changer statut (LIBRE/OCCUPÉE)
PUT    /tables/:id                 ✅ Modifier table
DELETE /tables/:id                 ✅ Supprimer table
```

### 📦 COMMANDES
```javascript
GET    /commandes                  ✅ Lister toutes
GET    /commandes/:id              ✅ Détails commande
GET    /commandes/statut/:statut   ✅ Filtrer par statut
GET    /commandes/utilisateur/:id  ✅ Commandes d'un client
POST   /commandes                  ✅ Créer commande
PATCH  /commandes/:id/statut       ✅ Changer statut
POST   /commandes/:id/annuler      ✅ Annuler commande
```

### ⭐ AVIS
```javascript
GET    /avis                       ✅ Lister tous
GET    /avis/commande/:id          ✅ Avis d'une commande
POST   /avis                       ✅ Créer avis
```

### 🧾 FACTURES
```javascript
GET    /factures                   ✅ Lister toutes
GET    /factures/:id               ✅ Détails facture
POST   /factures                   ✅ Créer facture
```

---

## 📊 Résumé Couverture

| Module | Endpoints | Implémentés | Couverture |
|--------|-----------|------------|-----------|
| Utilisateurs | 5 | 5 | ✅ 100% |
| Plats | 6 | 6 | ✅ 100% |
| Menus | 9 | 9 | ✅ 100% |
| Tables | 8 | 8 | ✅ 100% |
| Commandes | 7 | 7 | ✅ 100% |
| Avis | 3 | 3 | ✅ 100% |
| Factures | 3 | 3 | ✅ 100% |
| **TOTAL** | **41** | **41** | ✅ **100%** |

---

## 🔧 Comment Ça Marche

### Flux Requête HTTP

```
Frontend App
    ↓
plateService.getAll()  ← Appel service
    ↓
api.get('/plats')      ← Axios
    ↓
[Intercepteur Axios]   ← USE_MOCK_API = true
    ↓
handleMockRequest()    ← Cherche l'endpoint
    ↓
return mockData.plats  ← Retourne les données
    ↓
Service reçoit réponse
    ↓
Component affiche données
```

### Opérations CRUD

#### 🔍 READ (GET)
```javascript
// Service appelle
const response = await platService.getAll();

// Mock intercepte et retourne
GET /plats → mockData.plats
```

#### ✨ CREATE (POST)
```javascript
// Service appelle
await platService.create({ nomPlat: 'Burger', prix: 11 });

// Mock crée et retourne
POST /plats → addMockResource('plats', {...})
```

#### ✏️ UPDATE (PUT)
```javascript
// Service appelle
await platService.update(1, { prix: 12 });

// Mock modifie et retourne
PUT /plats/1 → updateMockResource('plats', 1, {...})
```

#### 🗑️ DELETE (DELETE)
```javascript
// Service appelle
await platService.delete(1);

// Mock supprime
DELETE /plats/1 → deleteMockResource('plats', 1)
```

---

## 📝 Données par Défaut

### Plats (4)
- Pizza Margherita (12.50€)
- Pasta Carbonara (13€)
- Burger Classique (11€)
- Salade César (9.50€)

### Menus (2)
- Menu Découverte (25€) → [Pizza, Pasta]
- Menu Rapide (15€) → [Burger, Salade]

### Tables (3)
- Table 1 (4 places) → LIBRE
- Table 2 (6 places) → OCCUPÉE
- Table 3 (2 places) → LIBRE

### Utilisateurs (2)
- Admin: jean.dupont@example.com
- Client: marie.martin@example.com

### Commandes (1)
- CMD001 (Table 1, Client, CONFIRMÉE)

### Avis (1)
- 5 étoiles "Excellent restaurant!"

### Factures (1)
- FAC001 (25.50€, PAYÉE)

---

## 🎓 Utilisation dans les Services

Aucun changement requis! Les services continuent à utiliser l'API normalement:

```javascript
// Dans menuService.js (INCHANGÉ)
export const menuService = {
  getAll: () => api.get('/menus'),           // ✅ Fonctionne avec mock
  create: (data) => api.post('/menus', data), // ✅ Fonctionne avec mock
  update: (id, data) => api.put(`/menus/${id}`, data), // ✅ Fonctionne
  // ...
};
```

---

## 🔄 Persistance des Données

⚠️ **Important**: Les données mock sont stockées en mémoire (dans `mockData`).

- ✅ **Persistent pendant la session** → Modifications restent jusqu'au rechargement
- ❌ **Perte au rechargement** → Réinitialise aux données par défaut

### Pour la Persistance Permanente

Ajoutez localStorage ou IndexedDB dans `src/api/mockData.js`:

```javascript
// Sauvegarder après chaque modif
localStorage.setItem('mockData', JSON.stringify(mockData));

// Charger au démarrage
const saved = localStorage.getItem('mockData');
if (saved) Object.assign(mockData, JSON.parse(saved));
```

---

## ✅ Prêt à Tester

Tous les endpoints sont prêts! Lancez simplement:

```bash
npm run dev
```

Puis accédez à `/admin` pour tester le panel CRUD complet. 🎉
