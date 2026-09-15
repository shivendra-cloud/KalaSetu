import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { value: "2,500+", label: t('stat_artisans') },
    { value: "18K+",   label: t('stat_crafts') },
    { value: "42",     label: t('stat_categories') }
  ];

  return (
    <section className="ks-hero">
      <div className="ks-decoration ks-decoration-one" />
      <div className="ks-decoration ks-decoration-two" />

      <div className="ks-container">
        <motion.div
          className="ks-hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="ks-eyebrow">✦ {t('hero_eyebrow')}</span>
          <h1>
            {t('hero_title_line1')}
            <br />
            <span className="ks-gradient-text">{t('hero_title_line2')}</span>
          </h1>
          <p className="ks-hero-description">{t('hero_description')}</p>
          <div className="ks-hero-actions">
            <a href="#discover" className="ks-btn ks-btn-primary">
              {t('explore_crafts')} <FiArrowRight />
            </a>
            <a href="/create" className="ks-btn ks-btn-secondary">
              <FiPlay /> {t('sell_your_craft')}
            </a>
          </div>
          <div className="ks-stats">
            {stats.map((stat, index) => (
              <motion.div
                className="ks-stat"
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
              >
                <span className="ks-stat-number">{stat.value}</span>
                <span className="ks-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
