import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { getApproved } from '../utils/productStore';

// Normalize category: lowercase, remove trailing 's', trim
function normalizeCat(s) {
  if (!s) return '';
  return String(s).toLowerCase().trim().replace(/s$/, '');
}

export default function ProductGrid({ search = '', category = 'All' }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    // 1. Local first — instant render
    const local = getApproved() || [];
    setProducts(local);

    // 2. API fetch
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const apiData = await res.json();

      if (Array.isArray(apiData) && apiData.length > 0) {
        // Merge: API products + local, dedupe by _id
        const merged = [...apiData, ...local];
        const seen = new Set();
        const unique = merged.filter(p => {
          const id = String(p._id || p.id || '');
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setProducts(unique);
      }
    } catch (err) {
      console.warn('API fetch failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    const onChange = () => loadProducts();
    window.addEventListener('storage', onChange);
    window.addEventListener('kalasetu-products-updated', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('kalasetu-products-updated', onChange);
    };
  }, []);

  // ---------- FILTER ----------
  const q = (search || '').toLowerCase().trim();
  const normFilterCat = normalizeCat(category);

  const filtered = products.filter(p => {
    const pCat = normalizeCat(p.category || 'handicraft');

    // Category match: exact normalized OR empty filter
    const matchesCat = category === 'All' || normFilterCat === '' || pCat === normFilterCat;

    // Search match
    const matchesSearch = !q ||
      (p.name || p.title || '').toLowerCase().includes(q) ||
      (p.artisan || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  // Sort by category then name
  const sorted = [...filtered].sort((a, b) => {
    const catA = normalizeCat(a.category || 'handicraft');
    const catB = normalizeCat(b.category || 'handicraft');
    if (catA !== catB) return catA.localeCompare(catB);
    return (a.name || a.title || '').localeCompare(b.name || b.title || '');
  });

  // ---------- RENDER ----------
  if (loading && products.length === 0) {
    return <p className="ks-center">{t('loading') || 'Loading crafts...'}</p>;
  }

  if (sorted.length === 0) {
    return (
      <p className="ks-center">
        {t('no_products') || 'No products found'}
        {category !== 'All' && <><br /><small>Try selecting "All" to see everything</small></>}
      </p>
    );
  }

  return (
    <div className="ks-grid">
      {sorted.map(p => (
        <ProductCard
          key={p._id || p.id}
          product={{
            ...p,
            title: p.name || p.title,
            title_hi: p.name_hi || p.title_hi || p.name || p.title,
          }}
        />
      ))}
    </div>
  );
}
