import LanguageSwitcher from './LanguageSwitcher';
<LanguageSwitcher />
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderControls from './HeaderControls';

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="ks-navbar">
      <Link to="/" className="ks-logo">
        <span className="ks-logo-icon">🎨</span>
        <span className="ks-logo-text">{t('app_name')}</span>
      </Link>

      <div className="ks-nav-links">
        <Link to="/">{t('home')}</Link>
        <Link to="/">{t('products')}</Link>
        <Link to="/">{t('artisans')}</Link>
        <Link to="/admin">{t('admin_panel')}</Link>
      </div>

      <HeaderControls />
    </nav>
  );
}
