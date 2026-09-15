import { useTranslation } from 'react-i18next';

export default function CreateProduct() {
  const { t } = useTranslation();
  return (
    <div className="ks-page">
      <h1>{t('create_product')}</h1>
      <p>Coming soon — AI-assisted product listing.</p>
    </div>
  );
}
