import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

const stats = [
  { value: "2,500+", label: "Artisans" },
  { value: "18K+", label: "Crafts" },
  { value: "42", label: "Categories" }
];

export default function Hero() {
  return (
    <section className="ks-hero">
      <div className="ks-decoration ks-decoration-one" />
      <div className="ks-decoration ks-decoration-two" />

      <div className="ks-container">
        <motion.div className="ks-hero-content" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="ks-eyebrow">✦ AI-powered craft marketplace</span>
          <h1>
            India's craft.
            <br />
            <span className="ks-gradient-text">The world's canvas.</span>
          </h1>
          <p className="ks-hero-description">
            KalaSetu connects India's extraordinary artisans with customers around the world — preserving traditional craftsmanship while creating new opportunities through AI.
          </p>
          <div className="ks-hero-actions">
            <a href="#discover" className="ks-btn ks-btn-primary">Explore Crafts <FiArrowRight /></a>
            <a href="/create" className="ks-btn ks-btn-secondary"><FiPlay /> Sell Your Craft</a>
          </div>
          <div className="ks-stats">
            {stats.map((stat, index) => (
              <motion.div className="ks-stat" key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + index * 0.1 }}>
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