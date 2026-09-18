import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { getApproved } from '../utils/productStore';

export default function ProductGrid({ search = '', category = 'All' }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load approved products from local store
    const load = () => setProducts(getApproved());
    load();

    // Listen for changes from admin panel (same tab)
    const onChange = () => load();
    window.addEventListener('storage', onChange);
    window.addEventListener('kalasetu-products-updated', onChange);

    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('kalasetu-products-updated', onChange);
    };
  }, []);

  const q = (search || '').toLowerCase();
  const filtered = products.filter(p => {
    const matchesCat = category === 'All' || p.category === category;
    const matchesSearch = !q ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.artisan || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    return <p className="ks-center">{t('no_products') || 'No products found'}</p>;
  }

  return (
    <div className="ks-grid">
      {filtered.map(p => (
        <ProductCard
          key={p._id}
          product={{
            ...p,
            title: p.name,
            title_hi: p.name_hi || p.name,
          }}
        />
      ))}
    </div>
  );
}
