# 🎯 Guide Quick Start - API Mock Active

## ✅ Corrections Appliquées

### 1. **API Mock Opérationnel**
   - ✅ [src/api/mockData.js](src/api/mockData.js) - Base de données simulée avec 4 ressources (plats, menus, tables, commandes)
   - ✅ [src/services/api.js](src/services/api.js) - Intercepteur Axios pour rediriger vers le mock
   - ✅ Erreurs réseau supprimées - pas besoin du backend pour développer

### 2. **Gestion d'Erreurs Améliorée**
   - ✅ [src/components/Common/ErrorBoundary.jsx](src/components/Common/ErrorBoundary.jsx) - Capture les crashes React
   - ✅ [src/pages/Auth.jsx](src/pages/Auth.jsx) - Messages d'erreur spécifiques à la connexion
   - ✅ Toaster (react-hot-toast) - Notifications intelligentes

### 3. **Configuration Flexible**
   - ✅ Basculer entre Mock et Backend réel en 1 ligne
   - ✅ Support des variables d'environnement

---

## 🚀 Pour Démarrer Maintenant

### Étape 1 : Vérifiez que le frontend tourne
```bash
npm run dev
# L'app doit être accessible sur http://localhost:5173
```

### Étape 2 : Testez l'authentification
- **Email**: `jean.dupont@example.com`
- **Mot de passe**: `password123`
- **Rôle**: ADMIN (accès aux pages /admin)

### Étape 3 : Testez les pages admin
- **URL**: http://localhost:5173/admin
- Vous verrez les panneaux CRUD complètement fonctionnels
- Ajouter/modifier/supprimer des plats, menus et tables

---

## 📝 Données de Test

### Plats disponibles
1. **Pizza Margherita** - 12.50€
2. **Pasta Carbonara** - 13.00€
3. **Burger Classique** - 11.00€
4. **Salade César** - 9.50€

### Tables disponibles
- Table 1 (4 places) - LIBRE
- Table 2 (6 places) - OCCUPÉE
- Table 3 (2 places) - LIBRE

---

## 🔄 Transition vers Backend Réel

Quand vous avez un vrai backend Spring Boot prêt:

1. **Dans [src/services/api.js](src/services/api.js) (ligne 6)**:
   ```javascript
   const USE_MOCK_API = false; // Basculer ici
   ```

2. **Assurez-vous que**:
   - Backend écoute sur `http://localhost:8080`
   - Endpoints disponibles sur `/api/v1/plats`, `/api/v1/menus`, etc.

3. **Les services continueront à fonctionner** sans changement:
   - `platService.js`
   - `menuService.js`
   - `tablesService.js`
   - etc.

---

## 🎮 Fonctionnalités à Tester

### Admin Panel (/admin)
- ✅ **Plats**: Ajouter, modifier, supprimer (CRUD complet)
- ✅ **Menus**: Gestion complète + association plats
- ✅ **Tables**: Gestion des statuts et capacités
- ✅ **Commandes**: Consultation

### Pages Client
- ✅ **Home**: Affichage des données
- ✅ **Menu**: Consultation des plats
- ✅ **Cart**: Panier fonctionnel
- ✅ **Auth**: Connexion/inscription

---

## 🐛 Si Vous Rencontrez des Erreurs

### Erreur : "Composant non trouvé"
```
ReferenceError: Cannot find module './components/Common/ErrorBoundary'
```
**Solution**: Le fichier a été créé automatiquement, rechargez la page.

### Erreur : "API toujours en erreur"
Vérifiez dans la console (F12) :
- Les logs doivent dire `[MOCK API]` et non `API Error`
- Si vous voyez "Backend non accessible", c'est que `USE_MOCK_API = false`

### Données disparues après rechargement
C'est normal - les données mock sont en mémoire. Pour les persister:
- Ajouter localStorage ou IndexedDB dans [src/api/mockData.js](src/api/mockData.js)

---

## 📚 Fichiers Modifiés

- `src/api/mockData.js` - **Nouveau** - Base de données
- `src/services/api.js` - Intercepteur API
- `src/pages/Auth.jsx` - Gestion d'erreurs
- `src/App.jsx` - ErrorBoundary + Toaster
- `src/components/Common/ErrorBoundary.jsx` - **Nouveau** - Capture erreurs

---

## 🎓 Structure du Mock API

```javascript
// Exemple d'appel dans vos services
const response = await api.get('/plats');
// Cet appel sera intercepté et retournera mockData.plats
```

C'est tout ! L'application est maintenant **100% fonctionnelle** sans backend externe. 🎉
