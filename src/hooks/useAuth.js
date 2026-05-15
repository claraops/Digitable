import { useState, useEffect } from 'react';

const getInitialUser = () => {
  const id = localStorage.getItem('userId');
  const role = localStorage.getItem('userRole');
  return id ? { id, role } : null;
};

export const useAuth = () => {
  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    if (id) {
      setUser({ id, role });
    }
  }, []);

  const login = (userData) => {
    const id = userData.idUser ?? userData.id;
    const role = userData.role ?? 'CLIENT';
    localStorage.setItem('userId', id);
    localStorage.setItem('userRole', role);
    setUser({ id, role });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
};