import { useTranslation } from 'react-i18next';
if (localStorage.getItem('kalasetu_lang') === 'mr') localStorage.setItem('kalasetu_lang', 'en');
import './i18n';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)