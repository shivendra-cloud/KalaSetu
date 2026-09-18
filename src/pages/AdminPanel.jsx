import { useState, useEffect } from 'react';
import { FiRefreshCw, FiTrash2, FiPlus } from 'react-icons/fi';
import {
  getLocalProducts,
  addLocalProduct,
  deleteLocalProduct,
} from '../utils/productStore';

const ADMIN_PASSWORD = 'Admin123';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [apiWorks, setApiWorks] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Pottery',
    material: '', artisan: '', image: ''
  });

  useEffect(() => {
    if (authed) loadProducts();
  }, [authed]);

  const loadProducts = async () => {
    // Try API first (MongoDB)
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setApiWorks(true);
        return;
      }
      // API returned empty — use local
      setProducts(getLocalProducts());
      setApiWorks(false);
    } catch {
      setProducts(getLocalProducts());
      setApiWorks(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Wrong password');
    }
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError('Name and price are required');
      return;
    }
    const product = { ...newProduct, price: Number(newProduct.price) };

    // Try API first
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin': password },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        setNotice('Product added via API');
        loadProducts();
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback to local
      addLocalProduct(product);
      setNotice('Product added locally (shows on this device)');
      loadProducts();
    }

    setNewProduct({ name: '', description: '', price: '', category: 'Pottery', material: '', artisan: '', image: '' });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    if (id.startsWith('local_') || id.startsWith('m')) {
      deleteLocalProduct(id);
      setNotice('Deleted');
      loadProducts();
      return;
    }
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin': password }
      });
      if (res.ok) {
        setNotice('Deleted');
        loadProducts();
      } else {
        throw new Error();
      }
    } catch {
      deleteLocalProduct(id);
      setNotice('Deleted locally');
      loadProducts();
    }
  };

  if (!authed) {
    return (
      <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Admin Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          Demo password: <strong>Admin123</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Admin Panel</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {products.length} products · {apiWorks ? 'API connected' : 'Local mode'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ks-btn ks-btn-secondary" onClick={loadProducts}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="ks-btn ks-btn-primary" onClick={() => setShowAdd(!showAdd)}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {!apiWorks && (
        <div style={{ padding: 12, background: '#fef3c7', color: '#92400e', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem' }}>
          ⚠️ API unavailable (MongoDB not reachable from Vercel). Products added here are saved to this browser only.
        </div>
      )}

      {notice && (
        <div style={{ padding: 12, background: '#d1fae5', color: '#065f46', borderRadius: 8, marginBottom: 16 }}>
          {notice}
          <button onClick={() => setNotice('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {showAdd && (
        <div style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Add New Product</h3>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <input className="ks-search-input" placeholder="Product name *" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input className="ks-search-input" placeholder="Price (₹) *" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            <input className="ks-search-input" placeholder="Artisan name" value={newProduct.artisan} onChange={e => setNewProduct({...newProduct, artisan: e.target.value})} />
            <input className="ks-search-input" placeholder="Material" value={newProduct.material} onChange={e => setNewProduct({...newProduct, material: e.target.value})} />
            <select className="ks-select" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
              {['Pottery','Textiles','Woodwork','Metalwork','Painting','Jewellery','Handicraft'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input className="ks-search-input" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
            <textarea className="ks-search-input" placeholder="Description" rows={3} style={{ gridColumn: '1 / -1' }} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="ks-btn ks-btn-primary" onClick={handleAdd}>Save Product</button>
            <button className="ks-btn ks-btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {products.map(p => (
          <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 16, alignItems: 'center', padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <img src={p.image || 'https://via.placeholder.com/80'} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name || p.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {p.artisan && `${p.artisan} · `}{p.category} {p.price && `· ₹${p.price}`}
              </div>
            </div>
            <button onClick={() => handleDelete(p._id)} className="ks-btn ks-btn-secondary" style={{ color: '#ef4444' }}>
              <FiTrash2 />
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No products. Click "Add Product" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
