// api.js - version SIMPLIFIÉE
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // ✅ NE PAS mettre transformResponse
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

export default api;


/*import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // ✅ Désactiver la transformation automatique
    transformResponse: [(data) => {
        if (!data || data === '') return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Erreur parsing JSON:', e);
            return [];
        }
    }],
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        const basicAuth = localStorage.getItem('basicAuth');
        if (basicAuth) {
            config.headers.Authorization = `Basic ${basicAuth}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        if (error.code === 'ERR_NETWORK') {
            console.error('Backend non accessible. Vérifiez que Spring Boot tourne sur http://localhost:8080');
        }
        if (error.response?.status === 401) {
            console.error('Non authentifié. Veuillez vous connecter.');
        }
        if (error.response?.status === 403) {
            console.error('Accès refusé : rôle administrateur requis.');
        }
        return Promise.reject(error);
    }
);

export default api;*/