import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiSearch, FiX, FiUser, FiSun, FiMoon } from "react-icons/fi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.dataset.theme === "dark");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("kalasetu-theme", next ? "dark" : "light");
  };

  return (
    <header className={`ks-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="ks-container ks-nav-inner">
        <Link to="/" className="ks-logo">
          <div className="ks-logo-mark">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M5 23C7 12 11 8 16 8C21 8 25 12 27 23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 23H27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="ks-logo-name">KalaSetu</div>
            <span className="ks-logo-subtitle">कलासेतु</span>
          </div>
        </Link>

        <nav className="ks-nav-links">
          <NavLink to="/" className={({ isActive }) => `ks-nav-link ${isActive ? "active" : ""}`}>Discover</NavLink>
          <NavLink to="/create" className={({ isActive }) => `ks-nav-link ${isActive ? "active" : ""}`}>Sell Craft</NavLink>
        </nav>

        <div className="ks-nav-search">
          <FiSearch size={16} />
          <input type="search" placeholder="Search crafts..." aria-label="Search crafts" />
        </div>

        <div className="ks-navbar-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="ks-btn ks-btn-secondary" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          <button className="ks-avatar" aria-label="Open user profile"><FiUser /></button>
        </div>

        <button className="ks-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ padding: "15px 20px 20px", borderTop: "1px solid var(--ks-border)" }}>
          <NavLink to="/" className="ks-nav-link" onClick={() => setMobileOpen(false)}>Discover</NavLink>
          <NavLink to="/create" className="ks-nav-link" onClick={() => setMobileOpen(false)}>Sell Craft</NavLink>
        </div>
      )}
    </header>
  );
}