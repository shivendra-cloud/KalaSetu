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

  // Filter by search + category
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

  // Group products by category
  const grouped = filtered.reduce((acc, p) => {
    const cat = p.category || 'Handicraft';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Sort categories alphabetically for consistent display
  const categories = Object.keys(grouped).sort();

  // If a specific category is selected, don't show section headers
  const showHeaders = category === 'All';

  return (
    <div className="ks-category-wrapper">
      {categories.map(cat => (
        <section key={cat} className="ks-category-section">
          {showHeaders && (
            <div className="ks-category-heading">
              <h2>{cat}</h2>
              <span>{grouped[cat].length} {grouped[cat].length === 1 ? 'item' : 'items'}</span>
            </div>
          )}
          <div className="ks-grid">
            {grouped[cat].map(p => (
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
        </section>
      ))}
    </div>
  );
}
