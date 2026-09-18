import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';

const savedLang = localStorage.getItem('kalasetu_lang') || 'en';
const allowed = ['en', 'hi'];
const initialLang = allowed.includes(savedLang) ? savedLang : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

document.documentElement.lang = initialLang;

export default i18n;
