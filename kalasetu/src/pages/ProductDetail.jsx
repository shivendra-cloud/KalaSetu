import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const lang = i18n.language || 'en';

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => {});
  }, [id]);

  if (!product) return <p className="ks-center">{t('loading')}</p>;

  const title = (lang === 'hi' && product.title_hi) ? product.title_hi
              : (lang === 'mr' && product.title_mr) ? product.title_mr
              : product.title;

  const description = (lang === 'hi' && product.description_hi) ? product.description_hi
                    : (lang === 'mr' && product.description_mr) ? product.description_mr
                    : product.description;

  return (
    <div className="ks-page ks-detail">
      <Link to="/" className="ks-back">← {t('back_home')}</Link>
      <div className="ks-detail-grid">
        <img src={product.image} alt={title} />
        <div>
          <h1>{title}</h1>
          <p className="ks-artisan">{t('by')} {product.artisan}</p>
          <p>{description}</p>
          <p className="ks-price">₹{product.price.toLocaleString()}</p>
          <button className="ks-btn-primary">{t('buy_now')}</button>
        </div>
      </div>
    </div>
  );
}
