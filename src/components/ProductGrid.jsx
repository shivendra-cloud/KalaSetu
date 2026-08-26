import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ search, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(product => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="ks-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="ks-skeleton" style={{ width: '200px', height: '30px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="ks-container">
      {filtered.length > 0 ? (
        <div className="ks-product-grid">
          {filtered.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h3>No crafts found</h3>
          <p style={{ color: 'var(--ks-text-muted)' }}>Try another search or category.</p>
        </div>
      )}
    </div>
  );
}