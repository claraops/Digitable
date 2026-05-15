// Base de données mock - simulant l'API backend
export const mockData = {
  utilisateurs: [
    {
      id: 1,
      idUser: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      password: 'password123',
      telephone: '0612345678',
      langue: 'fr',
      role: 'ADMIN'
    },
    {
      id: 2,
      idUser: 2,
      nom: 'Martin',
      prenom: 'Marie',
      email: 'marie.martin@example.com',
      password: 'password456',
      telephone: '0698765432',
      langue: 'fr',
      role: 'CLIENT'
    }
  ],
  plats: [
    {
      idPlat: 1,
      nomPlat: 'Pizza Margherita',
      description: 'Pizza tomate, fromage, basilic',
      prix: 12.50,
      image: 'https://via.placeholder.com/400x300.png?text=Pizza+Margherita',
      categorie: 'Plats',
      disponibilite: true,
      note: 4.8
    },
    {
      idPlat: 2,
      nomPlat: 'Pasta Carbonara',
      description: 'Pâtes, œufs, lard, fromage',
      prix: 13.00,
      image: 'https://via.placeholder.com/400x300.png?text=Pasta+Carbonara',
      categorie: 'Plats',
      disponibilite: true,
      note: 4.7
    },
    {
      idPlat: 3,
      nomPlat: 'Burger Classique',
      description: 'Pain, boeuf, salade, tomate, oignon',
      prix: 11.00,
      image: 'https://via.placeholder.com/400x300.png?text=Burger+Classique',
      categorie: 'Plats',
      disponibilite: true,
      note: 4.6
    },
    {
      idPlat: 4,
      nomPlat: 'Salade César',
      description: 'Salade romaine, croutons, œuf, fromage',
      prix: 9.50,
      image: 'https://via.placeholder.com/400x300.png?text=Salade+Cesar',
      categorie: 'Salades',
      disponibilite: true,
      note: 4.9
    }
  ],
  menus: [
    {
      idMenu: 1,
      nomMenu: 'Menu Découverte',
      description: 'Menu complet pour découvrir nos spécialités',
      prix: 25.00,
      plats: [1, 2],
      actif: true
    },
    {
      idMenu: 2,
      nomMenu: 'Menu Rapide',
      description: 'Léger et savoureux',
      prix: 15.00,
      plats: [3, 4],
      actif: true
    }
  ],
  tables: [
    {
      idTable: 1,
      numeroTable: 1,
      capacite: 4,
      statut: 'LIBRE',
      localisation: 'Coin fenêtre'
    },
    {
      idTable: 2,
      numeroTable: 2,
      capacite: 6,
      statut: 'OCCUPEE',
      localisation: 'Centre'
    },
    {
      idTable: 3,
      numeroTable: 3,
      capacite: 2,
      statut: 'LIBRE',
      localisation: 'Terrasse'
    }
  ],
  commandes: [
    {
      idCommande: 1,
      numeroCommande: 'CMD001',
      idTable: 1,
      idClient: 2,
      utilisateurPrenom: 'Marie',
      utilisateurNom: 'Martin',
      numeroTable: 1,
      dateCommande: new Date().toISOString(),
      statut: 'CONFIRMEE',
      montantTotal: 25.50,
      platsCommandes: [
        { platId: 1, platNom: 'Pizza Margherita', quantite: 1, prixUnitaire: 12.50 },
        { platId: 2, platNom: 'Pasta Carbonara', quantite: 1, prixUnitaire: 13.00 }
      ]
    }
  ],
  avis: [
    {
      idAvis: 1,
      idClient: 2,
      contenu: 'Excellent restaurant!',
      note: 5,
      dateAvis: new Date().toISOString()
    }
  ],
  factures: [
    {
      idFacture: 1,
      numeroFacture: 'FAC001',
      idCommande: 1,
      montant: 25.50,
      dateFacture: new Date().toISOString(),
      statut: 'PAYEE'
    }
  ]
};

// Fonction pour récupérer une ressource avec ID
export const getMockResource = (resource, id) => {
  const data = mockData[resource];
  if (!data) return null;
  return data.find(item => {
    const keys = Object.keys(item);
    const idKey = keys.find(k => k.includes('id') && k !== 'idClient');
    return item[idKey] === parseInt(id);
  });
};

// Fonction pour ajouter une ressource
export const addMockResource = (resource, item) => {
  if (!mockData[resource]) return null;
  const newItem = {
    ...item,
    [Object.keys(item)[0].includes('id') ? Object.keys(item)[0] : `id${resource}`]: 
      Math.max(...mockData[resource].map(r => parseInt(Object.values(r)[0])), 0) + 1
  };
  mockData[resource].push(newItem);
  return newItem;
};

// Fonction pour mettre à jour une ressource
export const updateMockResource = (resource, id, updates) => {
  const data = mockData[resource];
  if (!data) return null;
  const index = data.findIndex(item => {
    const keys = Object.keys(item);
    const idKey = keys.find(k => k.includes('id') && k !== 'idClient');
    return item[idKey] === parseInt(id);
  });
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    return data[index];
  }
  return null;
};

// Fonction pour supprimer une ressource
export const deleteMockResource = (resource, id) => {
  const data = mockData[resource];
  if (!data) return false;
  const index = data.findIndex(item => {
    const keys = Object.keys(item);
    const idKey = keys.find(k => k.includes('id') && k !== 'idClient');
    return item[idKey] === parseInt(id);
  });
  if (index !== -1) {
    data.splice(index, 1);
    return true;
  }
  return false;
};
