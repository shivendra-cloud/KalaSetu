import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'Admin123';
const STORAGE_KEY = 'kalasetu_admin_products';

const MOCK_PRODUCTS = [
  { _id: 'm1', name: 'Blue Pottery Vase', price: 1200, category: 'Pottery', artisan: 'Ramesh Kumar', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500' },
  { _id: 'm2', name: 'Handwoven Silk Saree', price: 5500, category: 'Textiles', artisan: 'Sita Devi', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' },
  { _id: 'm3', name: 'Wooden Handicraft Box', price: 800, category: 'Woodwork', artisan: 'Mohan Lal', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500' },
];

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveLocal(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

// HARDCODED COLORS — no CSS variables, guaranteed visible
const C = {
  bg: '#0f0f0f',
  card: '#1a1a1a',
  border: '#2a2a2a',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  accent: '#d97706',
  danger: '#ef4444',
  success: '#22c55e',
};

const input = {
  width: '100%',
  padding: 12,
  background: '#0f0f0f',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  color: '#ffffff',
  fontSize: 15,
  marginBottom: 12,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const btn = {
  padding: '12px 20px',
  background: C.accent,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnGhost = {
  padding: '12px 20px',
  background: 'transparent',
  color: '#ffffff',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  fontSize: 15,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: 'Pottery', artisan: '', image: '', description: '' });

  useEffect(() => {
    if (authed) setProducts([...loadLocal(), ...MOCK_PRODUCTS]);
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError(''); }
    else setError('Wrong password');
  };

  const handleAdd = () => {
    if (!form.name || !form.price) { setError('Name and price required'); return; }
    const newProduct = {
      _id: 'local_' + Date.now(),
      name: form.name,
      price: Number(form.price),
      category: form.category,
      artisan: form.artisan,
      image: form.image || 'https://via.placeholder.com/300',
      description: form.description,
    };
    const next = [newProduct, ...loadLocal()];
    saveLocal(next);
    setProducts([...next, ...MOCK_PRODUCTS]);
    setForm({ name: '', price: '', category: 'Pottery', artisan: '', image: '', description: '' });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    if (!id.startsWith('local_') && !id.startsWith('m')) return;
    const next = loadLocal().filter(p => p._id !== id);
    saveLocal(next);
    setProducts([...next, ...MOCK_PRODUCTS]);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, padding: 24 }}>
        <div style={{ maxWidth: 400, margin: '60px auto', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h1 style={{ fontSize: 24, marginBottom: 16, color: C.text }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={input}
              autoFocus
            />
            <button type="submit" style={{ ...btn, width: '100%' }}>Login</button>
          </form>
          {error && <p style={{ color: C.danger, marginTop: 12, fontSize: 14 }}>{error}</p>}
          <p style={{ color: C.textMuted, marginTop: 12, fontSize: 13 }}>Password: Admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 22, color: C.text }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnGhost} onClick={() => setShowAdd(!showAdd)}>+ Add</button>
            <button style={btnGhost} onClick={() => { setAuthed(false); setPassword(''); }}>Logout</button>
          </div>
        </div>

        <p style={{ color: C.textMuted, marginBottom: 16, fontSize: 14 }}>
          {products.length} products · Local mode (saved in this browser)
        </p>

        {showAdd && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: C.text, marginBottom: 16, fontSize: 16 }}>Add New Product</h3>
            <input style={input} placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={input} placeholder="Price (₹) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input style={input} placeholder="Artisan" value={form.artisan} onChange={e => setForm({ ...form, artisan: e.target.value })} />
            <input style={input} placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            <select style={input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Painting', 'Jewellery', 'Handicraft'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea style={{ ...input, minHeight: 80 }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn} onClick={handleAdd}>Save</button>
              <button style={btnGhost} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <img
                src={p.image}
                alt=""
                style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, background: '#333' }}
                onError={e => { e.target.src = 'https://via.placeholder.com/70'; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: C.textMuted, fontSize: 13 }}>{p.artisan || '—'} · {p.category} · ₹{p.price}</div>
              </div>
              <button onClick={() => handleDelete(p._id)} style={{ ...btnGhost, color: C.danger, padding: '8px 12px' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
