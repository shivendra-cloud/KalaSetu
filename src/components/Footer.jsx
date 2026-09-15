import { useTranslation } from 'react-i18next';
import { FiInstagram, FiFacebook, FiTwitter, FiArrowRight } from "react-icons/fi";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="ks-footer">
      <div className="ks-container">
        <div className="ks-footer-grid">
          <div className="ks-footer-brand">
            <h2>{t('kalasetu')}</h2>
            <p>{t('footer_tagline')}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          <div>
            <h3>{t('explore')}</h3>
            <div className="ks-footer-links">
              <a href="#">{t('discover_crafts')}</a>
              <a href="#">{t('artisans')}</a>
              <a href="#">{t('categories')}</a>
              <a href="#">{t('new_arrivals')}</a>
            </div>
          </div>

          <div>
            <h3>{t('kalasetu')}</h3>
            <div className="ks-footer-links">
              <a href="#">{t('about')}</a>
              <a href="#">{t('become_an_artisan')}</a>
              <a href="#">{t('our_mission')}</a>
              <a href="#">{t('contact')}</a>
            </div>
          </div>

          <div>
            <h3>{t('stay_connected')}</h3>
            <p style={{ color: "#b8a99d", fontSize: "0.875rem" }}>
              {t('newsletter_text')}
            </p>
            <form className="ks-newsletter">
              <input type="email" placeholder={t('your_email')} aria-label="Email address" />
              <button className="ks-btn ks-btn-primary" aria-label="Subscribe">
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        <div className="ks-footer-bottom">
          <span>{t('footer_copyright')}</span>
          <span>{t('made_in_india')}</span>
        </div>
      </div>
    </footer>
  );
}
