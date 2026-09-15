import { useTranslation } from 'react-i18next';

export default function AdminPanel() {
  const { t } = useTranslation();
  return (
    <div className="ks-page">
      <h1>{t('admin_panel')}</h1>
      <p>Manage products and artisans here.</p>
    </div>
  );
}
