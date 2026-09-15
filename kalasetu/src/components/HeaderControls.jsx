import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';

export default function HeaderControls() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="ks-header-controls">
      <LanguageSwitcher />
      <button
        className="ks-theme-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
