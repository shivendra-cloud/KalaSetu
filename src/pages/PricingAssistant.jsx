import { useState } from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const CATEGORIES = ['Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Painting', 'Jewellery', 'Handicraft'];

export default function PricingAssistant() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pottery');
  const [material, setMaterial] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getPrice = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const r = await fetch('/api/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, material })
      });
      const data = await r.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ks-page" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 8 }}>
        💰 Pricing Assistant
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        AI suggests a competitive price based on category, material, and market trends.
      </p>

      <div style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6 }}>Product Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Blue Pottery Vase"
            className="ks-search-input"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6 }}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="ks-select"
            style={{ width: '100%' }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6 }}>Material</label>
          <input
            value={material}
            onChange={e => setMaterial(e.target.value)}
            placeholder="e.g. silk, brass, clay"
            className="ks-search-input"
            style={{ width: '100%' }}
          />
        </div>

        <button className="ks-btn ks-btn-primary" onClick={getPrice} disabled={loading}>
          <FiTrendingUp /> {loading ? 'Analyzing...' : 'Get AI Price Suggestion'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 32, padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>SUGGESTED PRICE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 16 }}>
            ₹{result.suggested.toLocaleString()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MIN</div>
              <div style={{ fontWeight: 700 }}>₹{result.min.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MARKET AVG</div>
              <div style={{ fontWeight: 700 }}>₹{result.market_avg.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX</div>
              <div style={{ fontWeight: 700 }}>₹{result.max.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}
