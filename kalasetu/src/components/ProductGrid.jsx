import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';

export default function ProductGrid({ search, category }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  const filtered = products.filter(p => {
    const matchesCat = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.artisan.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (loading) return <p className="ks-center">{t('loading')}</p>;
  if (filtered.length === 0) return <p className="ks-center">{t('no_products')}</p>;

  return (
    <div className="ks-grid">
      {filtered.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
