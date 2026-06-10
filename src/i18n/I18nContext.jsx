import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [langue, setLangue] = useState(() => localStorage.getItem('langue') || 'fr');

  useEffect(() => {
    localStorage.setItem('langue', langue);
    document.documentElement.lang = langue;
  }, [langue]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[langue];
    for (const k of keys) {
      if (value == null) return key;
      value = value[k];
    }
    return value ?? key;
  }, [langue]);

  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) setLangue(lang);
  }, []);

  return (
    <I18nContext.Provider value={{ t, langue, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}