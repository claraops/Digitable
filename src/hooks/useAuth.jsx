// src/hooks/useAuth.jsx
import { useState, useEffect, useContext, createContext, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Helper pour nettoyer le stockage
    const clearAuthStorage = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('basicAuth');
    }, []);

    // Initialisation au montage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const basicAuth = localStorage.getItem('basicAuth');
        
        if (storedUser && (token || basicAuth)) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Erreur parsing user:', e);
                clearAuthStorage();
            }
        } else {
            clearAuthStorage();
        }
        setLoading(false);
    }, [clearAuthStorage]);

    // Login amélioré - gère token ET basicAuth
    const login = useCallback((userData, token = null, basicAuth = null) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (token) {
            localStorage.setItem('token', token);
        }
        if (basicAuth) {
            localStorage.setItem('basicAuth', basicAuth);
        }
    }, []);

    // Logout nettoyé
    const logout = useCallback(() => {
        setUser(null);
        clearAuthStorage();
    }, [clearAuthStorage]);

    // isAuthenticated comme fonction (pour compatibilité)
    const isAuthenticated = useCallback(() => {
        return !!user && (!!localStorage.getItem('token') || !!localStorage.getItem('basicAuth'));
    }, [user]);

    // ✅ UN SEUL isAdmin - basé sur l'état React
    const isAdmin = useCallback(() => {
        if (!user) return false;
        const role = user.role || user.authorities?.[0];
        return role === 'ADMIN' || role === 'ROLE_ADMIN';
    }, [user]);

    // ✅ getUser pour récupérer l'utilisateur courant
    const getUser = useCallback(() => user, [user]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            isAuthenticated, 
            isAdmin,
            getUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};