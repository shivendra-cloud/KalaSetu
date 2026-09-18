import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { getApproved } from '../utils/productStore';

export default function ProductGrid({ search = '', category = 'All' }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = () => setProducts(getApproved());
    load();
    window.addEventListener('storage', load);
    window.addEventListener('kalasetu-products-updated', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('kalasetu-products-updated', load);
    };
  }, []);

  const q = (search || '').toLowerCase();

  // Filter
  const filtered = products.filter(p => {
    const matchesCat = category === 'All' || p.category === category;
    const matchesSearch = !q ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.artisan || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Sort by category alphabetically, then by name
  const sorted = [...filtered].sort((a, b) => {
    const catA = a.category || 'Handicraft';
    const catB = b.category || 'Handicraft';
    if (catA !== catB) return catA.localeCompare(catB);
    return (a.name || '').localeCompare(b.name || '');
  });

  if (sorted.length === 0) {
    return <p className="ks-center">{t('no_products') || 'No products found'}</p>;
  }

  // Flat grid — no section headers
  return (
    <div className="ks-grid">
      {sorted.map(p => (
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
