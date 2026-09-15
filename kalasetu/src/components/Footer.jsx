import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="ks-footer">
      <p>© 2026 {t('app_name')} — {t('footer_text')}</p>
    </footer>
  );
}
