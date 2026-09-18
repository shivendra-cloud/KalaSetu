import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { getAll } from '../utils/productStore';

const C = {
  bg: 'var(--bg, #0f0f0f)',
  card: 'var(--bg-card, #1a1a1a)',
  border: 'var(--border, #2a2a2a)',
  text: 'var(--text, #fff)',
  muted: 'var(--text-muted, #a0a0a0)',
  accent: 'var(--accent, #d97706)',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // 1. Try local store first
      const local = getAll().find(p => String(p._id) === String(id));
      if (local) {
        if (!cancelled) { setProduct(local); setLoading(false); }
        return;
      }

      // 2. Fall back to API
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!cancelled) {
          setProduct(data && !data.error ? data : null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setProduct(null); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="ks-page ks-center" style={{ padding: 60 }}>
        <p>{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ks-page ks-center" style={{ padding: 60 }}>
        <h2 style={{ marginBottom: 16 }}>Product not found</h2>
        <Link to="/" className="ks-btn ks-btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const title =
    (lang === 'hi' && product.title_hi) ? product.title_hi
    : (product.name || product.title || 'Untitled');

  const description =
    (lang === 'hi' && product.description_hi) ? product.description_hi
    : (product.description || '');

  const image = product.image || 'https://via.placeholder.com/600';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <div className="ks-detail-page">
      {/* Back link */}
      <div className="ks-detail-container">
        <button
          onClick={() => navigate(-1)}
          className="ks-back-btn"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="ks-detail-grid">
          {/* Image */}
          <div className="ks-detail-image">
            <img
              src={image}
              alt={title}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600'; }}
            />
            {product.category && (
              <span className="ks-detail-category">{product.category}</span>
            )}
          </div>

          {/* Info */}
          <div className="ks-detail-info">
            <h1 className="ks-detail-title">{title}</h1>

            {product.artisan && (
              <p className="ks-detail-artisan">
                <span className="ks-detail-label">Artisan:</span> {product.artisan}
              </p>
            )}

            {product.material && (
              <p className="ks-detail-artisan">
                <span className="ks-detail-label">Material:</span> {product.material}
              </p>
            )}

            {product.location && (
              <p className="ks-detail-artisan">
                <span className="ks-detail-label">From:</span> {product.location}
              </p>
            )}

            <div className="ks-detail-price">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </div>

            {description && (
              <div className="ks-detail-description">
                <h3>About this craft</h3>
                <p>{description}</p>
              </div>
            )}

            {product.tags && (
              <div className="ks-detail-tags">
                {String(product.tags).split(',').map((tag, i) => (
                  <span key={i} className="ks-tag">{tag.trim()}</span>
                ))}
              </div>
            )}

            <div className="ks-detail-actions">
              <button className="ks-btn-primary ks-btn-lg">
                <FiShoppingCart /> {t('add_to_cart') || 'Add to Cart'}
              </button>
              <button className="ks-btn-secondary ks-btn-lg">
                <FiHeart />
              </button>
              <button className="ks-btn-secondary ks-btn-lg" onClick={handleShare}>
                <FiShare2 />
              </button>
            </div>

            <div className="ks-detail-meta">
              <div className="ks-meta-item">
                <span>🚚</span>
                <div>
                  <strong>Free Shipping</strong>
                  <small>Across India</small>
                </div>
              </div>
              <div className="ks-meta-item">
                <span>🎨</span>
                <div>
                  <strong>100% Handmade</strong>
                  <small>Authentic craft</small>
                </div>
              </div>
              <div className="ks-meta-item">
                <span>💯</span>
                <div>
                  <strong>Verified Artisan</strong>
                  <small>Direct from maker</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
