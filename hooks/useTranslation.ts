import { useState, useEffect } from 'react';
import { Language, getTranslation } from '../i18n/translations';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nativo_language');
    if (saved === 'es' || saved === 'en') return saved;
    
    // Auto-detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('nativo_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return { t, language, changeLanguage };
};
