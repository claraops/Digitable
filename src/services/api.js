import axios from 'axios';
import { mockData, getMockResource, addMockResource, updateMockResource, deleteMockResource } from '../api/mockData';

// Utilisez l'URL du backend configurée dans Vite ou la valeur par défaut en local.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const USE_MOCK_API = true; // Set to false when backend is available

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour les requêtes (utilise mock API si backend non dispo)
api.interceptors.request.use(config => {
    if (USE_MOCK_API) {
        config.adapter = async (config) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const response = handleMockRequest(config);
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                }, 300); // Simule un délai réseau
            });
        };
    }
    return config;
});

const enrichCommande = (commande) => {
    if (!commande) return null;

    const user = getMockResource('utilisateurs', commande.idClient);
    const table = getMockResource('tables', commande.idTable);

    const platsCommandes = commande.platsCommandes || (Array.isArray(commande.plats)
        ? commande.plats.map((platId) => {
            const plat = getMockResource('plats', platId);
            return {
                platId,
                platNom: plat?.nomPlat || 'Plat',
                quantite: 1,
                prixUnitaire: plat?.prix || 0,
            };
        })
        : []);

    const montantTotal = commande.montantTotal ?? commande.total ?? platsCommandes.reduce(
        (sum, item) => sum + item.prixUnitaire * item.quantite,
        0
    );

    return {
        ...commande,
        utilisateurPrenom: commande.utilisateurPrenom || user?.prenom || '',
        utilisateurNom: commande.utilisateurNom || user?.nom || '',
        numeroTable: commande.numeroTable || table?.numeroTable || commande.idTable,
        montantTotal,
        platsCommandes,
    };
};

// Fonction pour gérer les requêtes mock
const handleMockRequest = (config) => {
    const url = config.url || '';
    const method = config.method?.toUpperCase() || 'GET';
    const data = config.data ? JSON.parse(typeof config.data === 'string' ? config.data : JSON.stringify(config.data)) : null;

    console.log(`[MOCK API] ${method} ${url}`, data);

    // GET /utilisateurs
    if (url === '/utilisateurs' && method === 'GET') {
        return { status: 200, data: mockData.utilisateurs, config, statusText: 'OK', headers: {} };
    }

    // GET /utilisateurs/:id
    if (url.match(/\/utilisateurs\/\d+$/) && method === 'GET') {
        const id = parseInt(url.split('/').pop());
        const user = getMockResource('utilisateurs', id);
        if (user) {
            return { status: 200, data: user, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Utilisateur non trouvé');
    }

    // POST /utilisateurs
    if (url === '/utilisateurs' && method === 'POST') {
        const newUser = addMockResource('utilisateurs', data);
        return { status: 201, data: newUser, config, statusText: 'Created', headers: {} };
    }

    // PUT /utilisateurs/:id
    if (url.match(/\/utilisateurs\/\d+$/) && method === 'PUT') {
        const id = parseInt(url.split('/').pop());
        const updated = updateMockResource('utilisateurs', id, data);
        if (updated) {
            return { status: 200, data: updated, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Utilisateur non trouvé');
    }

    // DELETE /utilisateurs/:id
    if (url.match(/\/utilisateurs\/\d+$/) && method === 'DELETE') {
        const id = parseInt(url.split('/').pop());
        if (deleteMockResource('utilisateurs', id)) {
            return { status: 200, data: {}, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Utilisateur non trouvé');
    }

    // GET /utilisateurs/email/:email
    if (url.includes('/utilisateurs/email/')) {
        const email = url.split('/utilisateurs/email/')[1];
        const user = mockData.utilisateurs.find(u => u.email === email);
        if (user) {
            return { status: 200, data: user, config, statusText: 'OK', headers: {} };
        }
        throw new Error('User not found');
    }

    // GET /plats
    if (url === '/plats' && method === 'GET') {
        return { status: 200, data: mockData.plats, config, statusText: 'OK', headers: {} };
    }

    // GET /plats/disponibles
    if (url === '/plats/disponibles' && method === 'GET') {
        const actifs = mockData.plats.filter(p => p.actif);
        return { status: 200, data: actifs, config, statusText: 'OK', headers: {} };
    }

    // GET /plats/:id
    if (url.match(/\/plats\/\d+$/) && method === 'GET') {
        const id = parseInt(url.split('/').pop());
        const plat = getMockResource('plats', id);
        if (plat) {
            return { status: 200, data: plat, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Plat not found');
    }

    // PUT /plats/:id
    if (url.match(/\/plats\/\d+$/) && method === 'PUT') {
        const id = parseInt(url.split('/').pop());
        const updated = updateMockResource('plats', id, data);
        if (updated) {
            return { status: 200, data: updated, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Plat not found');
    }

    // DELETE /plats/:id
    if (url.match(/\/plats\/\d+$/) && method === 'DELETE') {
        const id = parseInt(url.split('/').pop());
        if (deleteMockResource('plats', id)) {
            return { status: 200, data: {}, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Plat not found');
    }

    // GET /menus
    if (url === '/menus' && method === 'GET') {
        return { status: 200, data: mockData.menus, config, statusText: 'OK', headers: {} };
    }

    // GET /menus/actifs
    if (url === '/menus/actifs' && method === 'GET') {
        const actifs = mockData.menus.filter(m => m.actif);
        return { status: 200, data: actifs, config, statusText: 'OK', headers: {} };
    }

    // GET /menus/:id
    if (url.match(/\/menus\/\d+$/) && method === 'GET') {
        const id = parseInt(url.split('/').pop());
        const menu = getMockResource('menus', id);
        if (menu) {
            return { status: 200, data: menu, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu not found');
    }

    // GET /menus/:id/plats
    if (url.match(/\/menus\/\d+\/plats$/) && method === 'GET') {
        const menuId = parseInt(url.split('/')[2]);
        const menu = getMockResource('menus', menuId);
        if (menu && menu.plats) {
            const plats = mockData.plats.filter(p => menu.plats.includes(p.idPlat));
            return { status: 200, data: plats, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu not found');
    }

    // POST /menus/:id/plats/:platId
    if (url.match(/\/menus\/\d+\/plats\/\d+$/) && method === 'POST') {
        const [menuId, platId] = url.match(/\d+/g).map(Number);
        const menu = getMockResource('menus', menuId);
        if (menu && !menu.plats.includes(platId)) {
            menu.plats.push(platId);
            return { status: 200, data: menu, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu or plat not found');
    }

    // DELETE /menus/:id/plats/:platId
    if (url.match(/\/menus\/\d+\/plats\/\d+$/) && method === 'DELETE') {
        const [menuId, platId] = url.match(/\d+/g).map(Number);
        const menu = getMockResource('menus', menuId);
        if (menu) {
            menu.plats = menu.plats.filter(p => p !== platId);
            return { status: 200, data: menu, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu not found');
    }

    // PUT /menus/:id
    if (url.match(/\/menus\/\d+$/) && method === 'PUT') {
        const id = parseInt(url.split('/').pop());
        const updated = updateMockResource('menus', id, data);
        if (updated) {
            return { status: 200, data: updated, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu not found');
    }

    // DELETE /menus/:id
    if (url.match(/\/menus\/\d+$/) && method === 'DELETE') {
        const id = parseInt(url.split('/').pop());
        if (deleteMockResource('menus', id)) {
            return { status: 200, data: {}, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Menu not found');
    }

    // GET /tables
    if (url === '/tables' && method === 'GET') {
        return { status: 200, data: mockData.tables, config, statusText: 'OK', headers: {} };
    }

    // GET /tables/disponibles
    if (url === '/tables/disponibles' && method === 'GET') {
        const libres = mockData.tables.filter(t => t.statut === 'LIBRE');
        return { status: 200, data: libres, config, statusText: 'OK', headers: {} };
    }

    // GET /tables/statistiques
    if (url === '/tables/statistiques' && method === 'GET') {
        const stats = {
            total: mockData.tables.length,
            libres: mockData.tables.filter(t => t.statut === 'LIBRE').length,
            occupees: mockData.tables.filter(t => t.statut === 'OCCUPEE').length
        };
        return { status: 200, data: stats, config, statusText: 'OK', headers: {} };
    }

    // GET /tables/:id
    if (url.match(/\/tables\/\d+$/) && method === 'GET' && !url.includes('/statut')) {
        const id = parseInt(url.split('/').pop());
        const table = getMockResource('tables', id);
        if (table) {
            return { status: 200, data: table, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Table not found');
    }

    // PATCH /tables/:id/statut
    if (url.match(/\/tables\/\d+\/statut/) && method === 'PATCH') {
        const id = parseInt(url.match(/\d+/)[0]);
        const statut = url.split('statut=')[1];
        const table = getMockResource('tables', id);
        if (table) {
            table.statut = statut || 'LIBRE';
            return { status: 200, data: table, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Table not found');
    }

    // PUT /tables/:id
    if (url.match(/\/tables\/\d+$/) && method === 'PUT') {
        const id = parseInt(url.split('/').pop());
        const updated = updateMockResource('tables', id, data);
        if (updated) {
            return { status: 200, data: updated, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Table not found');
    }

    // DELETE /tables/:id
    if (url.match(/\/tables\/\d+$/) && method === 'DELETE') {
        const id = parseInt(url.split('/').pop());
        if (deleteMockResource('tables', id)) {
            return { status: 200, data: {}, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Table not found');
    }

    // GET /commandes
    if (url === '/commandes' && method === 'GET') {
        return { status: 200, data: mockData.commandes.map(enrichCommande), config, statusText: 'OK', headers: {} };
    }

    // POST /commandes
    if (url === '/commandes' && method === 'POST') {
        const newCommande = addMockResource('commandes', data);
        return { status: 201, data: enrichCommande(newCommande), config, statusText: 'Created', headers: {} };
    }

    // GET /commandes/:id
    if (url.match(/\/commandes\/\d+$/) && method === 'GET' && !url.includes('/statut') && !url.includes('/annuler')) {
        const id = parseInt(url.split('/').pop());
        const commande = getMockResource('commandes', id);
        if (commande) {
            return { status: 200, data: enrichCommande(commande), config, statusText: 'OK', headers: {} };
        }
        throw new Error('Commande not found');
    }

    // GET /commandes/statut/:statut
    if (url.includes('/commandes/statut/') && method === 'GET') {
        const statut = url.split('/statut/')[1];
        const filtered = mockData.commandes.filter(c => c.statut === statut);
        return { status: 200, data: filtered, config, statusText: 'OK', headers: {} };
    }

    // PATCH /commandes/:id/statut
    if (url.match(/\/commandes\/\d+\/statut/) && method === 'PATCH') {
        const id = parseInt(url.match(/\d+/)[0]);
        const statut = url.split('statut=')[1];
        const commande = getMockResource('commandes', id);
        if (commande) {
            commande.statut = statut;
            return { status: 200, data: commande, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Commande not found');
    }

    // POST /commandes/:id/annuler
    if (url.match(/\/commandes\/\d+\/annuler$/) && method === 'POST') {
        const id = parseInt(url.match(/\d+/)[0]);
        const commande = getMockResource('commandes', id);
        if (commande) {
            commande.statut = 'ANNULEE';
            return { status: 200, data: commande, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Commande not found');
    }

    // GET /commandes/utilisateur/:userId
    if (url.includes('/commandes/utilisateur/') && method === 'GET') {
        const userId = parseInt(url.split('/utilisateur/')[1]);
        const filtered = mockData.commandes.filter(c => c.idClient === userId);
        return { status: 200, data: filtered, config, statusText: 'OK', headers: {} };
    }

    // GET /avis
    if (url === '/avis' && method === 'GET') {
        return { status: 200, data: mockData.avis, config, statusText: 'OK', headers: {} };
    }

    // POST /avis
    if (url === '/avis' && method === 'POST') {
        const newAvis = addMockResource('avis', data);
        return { status: 201, data: newAvis, config, statusText: 'Created', headers: {} };
    }

    // GET /avis/commande/:id
    if (url.includes('/avis/commande/') && method === 'GET') {
        const commandeId = parseInt(url.split('/commande/')[1]);
        const filtered = mockData.avis.filter(a => a.idCommande === commandeId);
        return { status: 200, data: filtered, config, statusText: 'OK', headers: {} };
    }

    // GET /factures
    if (url === '/factures' && method === 'GET') {
        return { status: 200, data: mockData.factures, config, statusText: 'OK', headers: {} };
    }

    // POST /factures
    if (url === '/factures' && method === 'POST') {
        const newFacture = addMockResource('factures', data);
        return { status: 201, data: newFacture, config, statusText: 'Created', headers: {} };
    }

    // GET /factures/:id
    if (url.match(/\/factures\/\d+$/) && method === 'GET') {
        const id = parseInt(url.split('/').pop());
        const facture = getMockResource('factures', id);
        if (facture) {
            return { status: 200, data: facture, config, statusText: 'OK', headers: {} };
        }
        throw new Error('Facture not found');
    }

    // Default response for unmapped endpoints
    console.warn('[MOCK API] Endpoint not mapped:', method, url);
    return { status: 200, data: [], config, statusText: 'OK', headers: {} };
};

// Intercepteur pour les erreurs
api.interceptors.response.use(
    response => response,
    error => {
        const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
        console.error('API Error:', error.message);
        if (isNetworkError && !USE_MOCK_API) {
            console.error('Backend non accessible. Vérifiez que Spring Boot tourne sur http://localhost:8080');
        }
        return Promise.reject(error);
    }
);

export default api;