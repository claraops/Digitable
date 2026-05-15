# 🎮 Guide de Test Complet - API Mock Active

## 🚀 Démarrage Rapide (2 minutes)

### 1. Lancez le serveur
```bash
cd digitable-frontend
npm run dev
```
L'app ouvre sur http://localhost:5173

### 2. Allez à la page de connexion
```
http://localhost:5173/login
```

### 3. Connectez-vous (Admin)
```
Email:    jean.dupont@example.com
Mot de passe: password123
```

### 4. Accédez au panel admin
Cliquez sur le bouton en haut à droite ou allez à:
```
http://localhost:5173/admin
```

### 5. Testez les opérations
- Cliquez sur "Plats" pour le CRUD des plats
- Testez: Ajouter → Modifier → Supprimer

---

## 👥 Comptes de Test

### Compte Admin
```
Email:    jean.dupont@example.com
Mot de passe: password123
Rôle:     ADMIN
Accès:    Toutes les pages + Panel admin (/admin)
```

**À tester**: 
- Panel d'administration complet
- Gestion des plats, menus, tables
- Commandes et avis

### Compte Client
```
Email:    marie.martin@example.com
Mot de passe: password456
Rôle:     CLIENT
Accès:    Pages publiques uniquement
```

**À tester**:
- Consultation menu
- Panier
- Commandes personnelles
- Profil

---

## 🛠️ Opérations à Tester

### ✅ Administration des Plats (/admin/plats)

#### Ajouter un plat
1. Cliquez sur "Ajouter un plat" (bouton '+')
2. Remplissez le formulaire:
   - Nom: "Escalope Milanaise"
   - Description: "Pâtes, fromage, sauce tomate"
   - Prix: 14.50
3. Cliquez "Ajouter"
4. Vérifiez que le plat s'ajoute à la liste

#### Modifier un plat
1. Trouvez un plat dans la liste
2. Cliquez sur l'icône "Modifier" (✏️)
3. Changez le prix de "Pizza Margherita" de 12.50 à 13.50
4. Cliquez "Modifier"
5. Vérifiez que le prix change

#### Supprimer un plat
1. Cliquez sur l'icône "Supprimer" (🗑️) à droite d'un plat
2. Confirmez
3. Vérifiez que le plat disparaît

#### Rechercher
1. Tapez "Pizza" dans la barre de recherche
2. Vérifiez que seul "Pizza Margherita" s'affiche

### ✅ Administration des Menus (/admin/menus)

#### Ajouter un menu
1. Cliquez "Ajouter un menu"
2. Remplissez:
   - Nom: "Menu Spécial"
   - Description: "Notre sélection du jour"
   - Prix: 28.00
3. Sélectionnez les plats à ajouter
4. Cliquez "Ajouter"

#### Ajouter des plats à un menu
1. Ouvrez un menu existant
2. Cliquez "Ajouter un plat"
3. Sélectionnez un plat
4. Le plat s'ajoute à la liste

#### Retirer des plats
1. Cliquez sur la croix à côté d'un plat
2. Le plat est retiré du menu

### ✅ Administration des Tables (/admin/tables)

#### Ajouter une table
1. Cliquez "Ajouter une table"
2. Remplissez:
   - Numéro: 4
   - Capacité: 8 personnes
   - Localisation: "Coin restaurant"
3. Cliquez "Ajouter"

#### Changer le statut
1. Trouvez une table
2. Cliquez sur le bouton de statut (LIBRE/OCCUPÉE)
3. Le statut bascule

#### Modifier une table
1. Cliquez sur l'icône "Modifier"
2. Changez la localisation
3. Cliquez "Modifier"

### ✅ Consultation des Commandes (/admin/commandes)

- Voyez toutes les commandes
- Filtrez par statut (CONFIRMÉE, PRISE, LIVRÉE, ANNULÉE)
- Suivez les détails de chaque commande

---

## 📊 Données Initiales

### Plats Disponibles
| Nom | Description | Prix |
|-----|-------------|------|
| Pizza Margherita | Pizza tomate, fromage, basilic | 12.50€ |
| Pasta Carbonara | Pâtes, œufs, lard, fromage | 13.00€ |
| Burger Classique | Pain, boeuf, salade, tomate, oignon | 11.00€ |
| Salade César | Salade romaine, croutons, œuf, fromage | 9.50€ |

### Menus Disponibles
| Nom | Description | Prix | Plats |
|-----|-------------|------|-------|
| Menu Découverte | Menu complet pour découvrir | 25.00€ | Pizza + Pasta |
| Menu Rapide | Léger et savoureux | 15.00€ | Burger + Salade |

### Tables Disponibles
| Numéro | Capacité | Statut | Localisation |
|--------|----------|--------|--------------|
| 1 | 4 | LIBRE | Coin fenêtre |
| 2 | 6 | OCCUPÉE | Centre |
| 3 | 2 | LIBRE | Terrasse |

---

## 🔍 Vérifications Importantes

### Console Navigateur (F12)
Vous devriez voir les logs:
```
[MOCK API] GET /plats
[MOCK API] POST /plats
[MOCK API] PUT /plats/1
[MOCK API] DELETE /plats/1
```

### ❌ Si vous voyez "API Error: Network Error"
Cela signifie que `USE_MOCK_API` n'est pas activé. Vérifiez:
1. Ouvrez `src/services/api.js`
2. Ligne 6 doit être: `const USE_MOCK_API = true;`

### ❌ Si les données disparaissent au rechargement
C'est normal! Elles sont en mémoire. Pour persister:
- Ajoutez localStorage dans `src/api/mockData.js`
- Ou attendez que le backend soit prêt

---

## 🎓 Scénario Complet de Test (5 minutes)

### 1. Créer une nouvelle ressource
- Admin → Plats
- Cliquez "Ajouter"
- Nom: "Brochette de poulet"
- Prix: 10€
- Cliquez "Ajouter"
- ✅ Doit apparaître en bas de la liste

### 2. Modifier la ressource
- Trouvez "Brochette de poulet"
- Cliquez "Modifier"
- Changez le prix à 11€
- Cliquez "Modifier"
- ✅ Le prix doit changer

### 3. Ajouter à un menu
- Admin → Menus
- Ouvrez "Menu Rapide"
- Cliquez "Ajouter plat"
- Sélectionnez "Brochette de poulet"
- ✅ Doit s'ajouter à la liste

### 4. Retirer du menu
- Cliquez la croix à côté de "Brochette de poulet"
- ✅ Doit disparaître du menu

### 5. Supprimer complètement
- Admin → Plats
- Trouvez "Brochette de poulet"
- Cliquez "Supprimer"
- ✅ Doit disparaître de la liste

---

## 🐛 Dépannage

### Problème: Connexion échoue
**Solution**: Utilisez exactement les identifiants:
- jean.dupont@example.com (majuscules/minuscules comptent!)
- password123

### Problème: Admin panel vide
**Solution**: 
1. Rechargez la page (F5)
2. Vérifiez que vous êtes connecté en tant qu'admin
3. Ouvrez la console (F12) - cherchez les logs `[MOCK API]`

### Problème: Modifications disparaissent
**Normal!** Recharger la page réinitialise les données mock.
- Solution 1: Ajouter localStorage
- Solution 2: Utiliser le vrai backend

### Problème: Toaster (notifications) ne s'affiche pas
**Solution**: Vérifiez que `src/App.jsx` inclut:
```javascript
import { Toaster } from 'react-hot-toast';
...
<Toaster position="top-right" />
```

---

## 📈 Progression de Test

- [ ] Créer un plat
- [ ] Modifier un plat
- [ ] Supprimer un plat
- [ ] Rechercher par nom
- [ ] Créer un menu
- [ ] Ajouter plats au menu
- [ ] Retirer plats du menu
- [ ] Créer une table
- [ ] Changer statut table
- [ ] Consulter les commandes
- [ ] Se connecter en tant que client
- [ ] Consulter le menu client
- [ ] Tester le panier

---

## ✅ Tout Fonctionne!

Si vous pouvez faire tous les tests ci-dessus sans erreur, l'API Mock fonctionne parfaitement. 🎉

Vous êtes prêt à:
1. Développer votre backend Spring Boot
2. Basculer `USE_MOCK_API = false`
3. Intégrer le vrai backend
4. **Les services continueront à fonctionner sans changement!**

---

**Besoin d'aide?** Consultez:
- `CORRECTIONS_APPLIQUEES.md` - Qu'est-ce qui a changé
- `API_MOCK_COVERAGE.md` - Tous les endpoints
- `MOCK_API_README.md` - Configuration avancée
