import { FiInstagram, FiFacebook, FiTwitter, FiArrowRight } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="ks-footer">
      <div className="ks-container">
        <div className="ks-footer-grid">
          <div className="ks-footer-brand">
            <h2>KalaSetu</h2>
            <p>Bridging India's timeless craftsmanship with the world.</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          <div>
            <h3>Explore</h3>
            <div className="ks-footer-links">
              <a href="#">Discover Crafts</a>
              <a href="#">Artisans</a>
              <a href="#">Categories</a>
              <a href="#">New Arrivals</a>
            </div>
          </div>

          <div>
            <h3>KalaSetu</h3>
            <div className="ks-footer-links">
              <a href="#">About Us</a>
              <a href="#">Become an Artisan</a>
              <a href="#">Our Mission</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div>
            <h3>Stay connected</h3>
            <p style={{ color: "#b8a99d", fontSize: "0.875rem" }}>Get stories from India's artisans delivered to your inbox.</p>
            <form className="ks-newsletter">
              <input type="email" placeholder="Your email" aria-label="Email address" />
              <button className="ks-btn ks-btn-primary" aria-label="Subscribe"><FiArrowRight /></button>
            </form>
          </div>
        </div>

        <div className="ks-footer-bottom">
          <span>© 2026 KalaSetu. Crafted with purpose.</span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}