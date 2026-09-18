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
    <div className="ks-lang-switch">
      <span className="ks-lang-icon" aria-hidden="true">अ/A</span>
      <select
        aria-label="Select language"
        value={i18n.language}
        onChange={(e) => change(e.target.value)}
      >
        {LANGS.map(l => (
          <option key={l.code} value={l.code}>{l.native}</option>
        ))}
      </select>
    </div>
  );
}
