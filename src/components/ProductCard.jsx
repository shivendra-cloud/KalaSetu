import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const title =
    (lang === 'hi' && product.title_hi) ? product.title_hi
    : (product.title || product.name || 'Untitled');

  const description =
    (lang === 'hi' && product.description_hi) ? product.description_hi
    : (product.description || '');

  const id = product._id || product.id;
  const image = product.image || 'https://via.placeholder.com/400';

  return (
    <div className="ks-product-card">
      <Link to={`/product/${id}`} className="ks-card-image-link">
        <div className="ks-card-image-wrap">
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
          />
          {product.category && (
            <span className="ks-category-badge">{product.category}</span>
          )}
          {product.status === 'pending' && (
            <span className="ks-status-badge pending">Pending</span>
          )}
        </div>
      </Link>

      <div className="ks-product-info">
        <Link to={`/product/${id}`} className="ks-card-title-link">
          <h3>{title}</h3>
        </Link>

        {description && (
          <p className="ks-desc">{description}</p>
        )}

        {product.artisan && (
          <p className="ks-artisan">{t('by')} {product.artisan}</p>
        )}

        <div className="ks-price-row">
          <span className="ks-price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
          <Link to={`/product/${id}`} className="ks-btn-cart">
            {t('view') || 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
}
