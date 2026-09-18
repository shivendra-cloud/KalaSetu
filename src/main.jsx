import './i18n';
if (typeof localStorage !== 'undefined' && localStorage.getItem('kalasetu_lang') === 'mr') localStorage.setItem('kalasetu_lang', 'en');
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)