import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiRefreshCw, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        headers: { 'x-admin': password || 'Admin123' },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text.slice(0, 100)}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setAuthed(true);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Admin123' || password === 'Admin') {
      setAuthed(true);
      fetchProducts();
    } else {
      setError('Wrong password');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin': password },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setNotice('Deleted');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!authed) {
    return (
      <div className="ks-page" style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Admin Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ks-search-input"
            autoFocus
          />
          <button type="submit" className="ks-btn ks-btn-primary">Login</button>
        </form>
        {error && (
          <div style={{ marginTop: 12, padding: 10, background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Hint: use Admin123
        </p>
      </div>
    );
  }

  return (
    <div className="ks-page" style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Admin — Products ({products.length})</h1>
        <button className="ks-btn ks-btn-secondary" onClick={fetchProducts} disabled={loading}>
          <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {notice && (
        <div style={{ padding: 12, background: '#d1fae5', color: '#065f46', borderRadius: 8, marginBottom: 16 }}>
          {notice}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No products yet</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {products.map(p => (
          <div
            key={p._id || p.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: 16,
              alignItems: 'center',
              padding: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          >
            <img
              src={p.image || 'https://via.placeholder.com/80'}
              alt={p.name || p.title}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
            />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name || p.title || 'Untitled'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {p.artisan && `${p.artisan} · `}{p.category || 'Uncategorized'} {p.price && `· ₹${p.price}`}
              </div>
            </div>
            <button
              onClick={() => deleteProduct(p._id || p.id)}
              className="ks-btn ks-btn-secondary"
              style={{ color: '#ef4444' }}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
