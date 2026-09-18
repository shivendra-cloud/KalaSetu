import { useState, useEffect } from 'react';
import {
  getAll, addProduct, updateStatus, deleteProduct,
  seedDemoData
} from '../utils/productStore';

const ADMIN_PASSWORD = 'Admin123';

const C = {
  bg: '#0f0f0f', card: '#1a1a1a', border: '#2a2a2a',
  text: '#ffffff', textMuted: '#a0a0a0',
  accent: '#d97706', danger: '#ef4444',
  success: '#22c55e', warning: '#f59e0b',
};

const input = {
  width: '100%', padding: 12, background: '#0f0f0f',
  border: '1px solid #2a2a2a', borderRadius: 8,
  color: '#ffffff', fontSize: 15, marginBottom: 12,
  boxSizing: 'border-box', fontFamily: 'inherit',
};

const btn = {
  padding: '10px 16px', borderRadius: 8, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  border: 'none',
};

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('pending');
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', category: 'Pottery', artisan: '',
    material: '', image: '', description: ''
  });

  const refresh = () => setProducts(getAll());

  useEffect(() => {
    if (authed) {
      seedDemoData();
      refresh();
    }
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else setError('Wrong password');
  };

  const counts = {
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const visible = products.filter(p => p.status === tab);

  const handleAdd = () => {
    if (!form.name || !form.price) {
      setError('Name and price required');
      return;
    }
    addProduct({
      name: form.name,
      price: Number(form.price),
      category: form.category,
      artisan: form.artisan,
      material: form.material,
      image: form.image || 'https://via.placeholder.com/300',
      description: form.description,
      status: 'pending',
    });
    setForm({ name: '', price: '', category: 'Pottery', artisan: '', material: '', image: '', description: '' });
    setShowAdd(false);
    setTab('pending');
    refresh();
  };

  const handleApprove = (id) => {
    updateStatus(id, 'approved');
    refresh();
  };

  const handleReject = (id) => {
    updateStatus(id, 'rejected');
    refresh();
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this product permanently?')) return;
    deleteProduct(id);
    refresh();
  };

  // ---------- LOGIN ----------
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, padding: 24 }}>
        <div style={{
          maxWidth: 400, margin: '60px auto',
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 24,
        }}>
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
            <button
              type="submit"
              style={{ ...btn, background: C.accent, color: '#fff', width: '100%', padding: 14 }}
            >
              Login
            </button>
          </form>
          {error && (
            <p style={{ color: C.danger, marginTop: 12, fontSize: 14 }}>{error}</p>
          )}
        </div>
      </div>
    );
  }

  // ---------- ADMIN PANEL ----------
  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24,
          flexWrap: 'wrap', gap: 12,
        }}>
          <h1 style={{ fontSize: 22, color: C.text }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...btn, background: C.accent, color: '#fff' }} onClick={() => setShowAdd(!showAdd)}>
              + Add Product
            </button>
            <button
              style={{ ...btn, background: 'transparent', border: `1px solid ${C.border}`, color: C.text }}
              onClick={() => { setAuthed(false); setPassword(''); }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap',
        }}>
          {[
            { key: 'pending', label: 'Pending', color: C.warning, count: counts.pending },
            { key: 'approved', label: 'Approved', color: C.success, count: counts.approved },
            { key: 'rejected', label: 'Rejected', color: C.danger, count: counts.rejected },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                ...btn,
                background: tab === t.key ? t.color : 'transparent',
                color: tab === t.key ? '#fff' : C.textMuted,
                border: `1px solid ${tab === t.key ? t.color : C.border}`,
                padding: '10px 18px',
              }}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Add Form */}
        {showAdd && (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: 20, marginBottom: 20,
          }}>
            <h3 style={{ color: C.text, marginBottom: 16, fontSize: 16 }}>Add New Product</h3>
            <div style={{
              display: 'grid', gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}>
              <input style={input} placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={input} placeholder="Price (₹) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <input style={input} placeholder="Artisan" value={form.artisan} onChange={e => setForm({ ...form, artisan: e.target.value })} />
              <input style={input} placeholder="Material" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} />
              <select style={input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Painting', 'Jewellery', 'Handicraft'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input style={input} placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <textarea
              style={{ ...input, minHeight: 80 }}
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...btn, background: C.accent, color: '#fff' }} onClick={handleAdd}>Save (as pending)</button>
              <button style={{ ...btn, background: 'transparent', border: `1px solid ${C.border}`, color: C.text }} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Product List */}
        <div style={{ display: 'grid', gap: 12 }}>
          {visible.length === 0 && (
            <div style={{
              padding: 40, textAlign: 'center',
              color: C.textMuted,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12,
            }}>
              No {tab} products
            </div>
          )}

          {visible.map(p => (
            <div
              key={p._id}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 16,
                display: 'flex', gap: 16, alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={p.image}
                alt=""
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: '#333' }}
                onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
              />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>
                  {p.name}
                </div>
                <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 4 }}>
                  {p.artisan || '—'} · {p.category} · {p.material || '—'} · ₹{p.price}
                </div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>
                  {p.description ? p.description.slice(0, 80) + (p.description.length > 80 ? '...' : '') : ''}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setViewing(p)}
                  style={{ ...btn, background: 'transparent', border: `1px solid ${C.border}`, color: C.text, padding: '8px 12px' }}
                >
                  View
                </button>

                {p.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    style={{ ...btn, background: C.success, color: '#fff', padding: '8px 12px' }}
                  >
                    ✓ Approve
                  </button>
                )}

                {p.status !== 'rejected' && p.status !== 'approved' && (
                  <button
                    onClick={() => handleReject(p._id)}
                    style={{ ...btn, background: C.warning, color: '#fff', padding: '8px 12px' }}
                  >
                    ✕ Reject
                  </button>
                )}

                {p.status === 'approved' && (
                  <button
                    onClick={() => handleReject(p._id)}
                    style={{ ...btn, background: 'transparent', border: `1px solid ${C.warning}`, color: C.warning, padding: '8px 12px' }}
                  >
                    Unapprove
                  </button>
                )}

                {p.status === 'rejected' && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    style={{ ...btn, background: C.success, color: '#fff', padding: '8px 12px' }}
                  >
                    Approve
                  </button>
                )}

                {!p._id.startsWith('m') && (
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{ ...btn, background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger, padding: '8px 12px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Modal */}
      {viewing && (
        <div
          onClick={() => setViewing(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 24, maxWidth: 600, width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            <img src={viewing.image} alt="" style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <h2 style={{ color: C.text, marginBottom: 8 }}>{viewing.name}</h2>
            <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 12 }}>
              {viewing.artisan || '—'} · {viewing.category} · {viewing.material || '—'}
            </div>
            <div style={{ color: C.accent, fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              ₹{viewing.price}
            </div>
            <p style={{ color: C.text, lineHeight: 1.6, marginBottom: 20 }}>
              {viewing.description || 'No description'}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{ ...btn, background: C.accent, color: '#fff' }}
                onClick={() => setViewing(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
