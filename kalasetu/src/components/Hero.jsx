import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="ks-hero">
      <h1>{t('hero_title')}</h1>
      <p>{t('hero_subtitle')}</p>
      <button
        className="ks-btn-primary"
        onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
      >
        {t('explore_now')}
      </button>
    </section>
  );
}
