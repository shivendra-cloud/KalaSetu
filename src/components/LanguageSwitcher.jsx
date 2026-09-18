import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी' },
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
      padding: '6px 10px',
      border: '1px solid currentColor',
      borderRadius: 8,
      opacity: 0.9
    }}>
      <span style={{ fontWeight: 700 }}>अ/A</span>
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
