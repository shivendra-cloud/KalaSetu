import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { getApproved } from '../utils/productStore';

export default function ProductGrid({ search = '', category = 'All' }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- Load products (local + API) ----------
  const loadProducts = async () => {
    // 1. Load from local store immediately (fast render)
    const local = getApproved();
    if (local.length > 0) {
      setProducts(local);
      setLoading(false);
    }

    // 2. Fetch from API (MongoDB) in background
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const apiData = await res.json();
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Merge API + local, dedupe by _id
          const merged = [...apiData, ...local];
          const seen = new Set();
          const unique = merged.filter(p => {
            const id = String(p._id || p.id);
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
          setProducts(unique);
        }
      }
    } catch (err) {
      console.warn('API fetch failed, using local only:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Refresh when admin updates products
    const onChange = () => loadProducts();
    window.addEventListener('storage', onChange);
    window.addEventListener('kalasetu-products-updated', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('kalasetu-products-updated', onChange);
    };
  }, []);

  // ---------- Filter ----------
  const q = (search || '').toLowerCase().trim();
  const filtered = products.filter(p => {
    const pCat = p.category || 'Handicraft';
    const matchesCat = category === 'All' || pCat.toLowerCase() === category.toLowerCase();
    const matchesSearch = !q ||
      (p.name || p.title || '').toLowerCase().includes(q) ||
      (p.artisan || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Sort by category then name
  const sorted = [...filtered].sort((a, b) => {
    const catA = (a.category || 'Handicraft').toLowerCase();
    const catB = (b.category || 'Handicraft').toLowerCase();
    if (catA !== catB) return catA.localeCompare(catB);
    return (a.name || '').localeCompare(b.name || '');
  });

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="ks-center" style={{ padding: '60px 20px' }}>
        <p>{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="ks-center" style={{ padding: '60px 20px' }}>
        <p>{t('no_products') || 'No products found'}</p>
      </div>
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
