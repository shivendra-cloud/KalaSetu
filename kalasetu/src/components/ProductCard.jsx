import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const title = (lang === 'hi' && product.title_hi) ? product.title_hi
              : (lang === 'mr' && product.title_mr) ? product.title_mr
              : product.title;

  const description = (lang === 'hi' && product.description_hi) ? product.description_hi
                    : (lang === 'mr' && product.description_mr) ? product.description_mr
                    : product.description;

  return (
    <div className="ks-product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={title} loading="lazy" />
      </Link>
      <div className="ks-product-info">
        <span className="ks-category-tag">{product.category}</span>
        <h3>{title}</h3>
        <p className="ks-desc">{description}</p>
        <p className="ks-artisan">{t('by')} {product.artisan}</p>
        <div className="ks-price-row">
          <span className="ks-price">₹{product.price.toLocaleString()}</span>
          <button className="ks-btn-cart">{t('add_to_cart')}</button>
        </div>
      </div>
    </div>
  );
}
