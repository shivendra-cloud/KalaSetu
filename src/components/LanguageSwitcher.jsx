import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी' },
  { code: 'mr', native: 'मराठी' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('kalasetu_lang', code);
    document.documentElement.lang = code;
  };

  return (
    <div className="ks-lang-switch" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: '1px solid currentColor',
      borderRadius: 8,
      padding: '4px 8px',
      opacity: 0.9,
      marginRight: 8,
    }}>
      <span style={{ fontWeight: 700, fontSize: '0.95rem', userSelect: 'none' }}>अ/A</span>
      <select
        aria-label="Select language"
        value={i18n.language}
        onChange={(e) => change(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {LANGS.map(l => (
          <option key={l.code} value={l.code} style={{ color: '#000' }}>
            {l.native}
          </option>
        ))}
      </select>
    </div>
  );
}
