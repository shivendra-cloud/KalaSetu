import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiUpload, FiCheck, FiDownload, FiX } from 'react-icons/fi';

export default function ImageStudio() {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const [original, setOriginal] = useState(null);
  const [enhanced, setEnhanced] = useState(null);
  const [thumb, setThumb] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setEnhanced(null);
    setThumb(null);
    setSuggestions([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setOriginal(dataUrl);
      setLoading(true);
      try {
        const r = await fetch('/api/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl })
        });
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        setEnhanced(data.enhanced);
        setThumb(data.thumbnail);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    if (!enhanced) return;
    const a = document.createElement('a');
    a.href = enhanced;
    a.download = `kalasetu-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="ks-page" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 8 }}>
        📸 AI Image Studio
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        Take a photo of your craft — AI removes clutter, fixes lighting, and formats it for e-commerce.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="ks-btn ks-btn-primary" onClick={() => fileRef.current?.click()}>
          <FiCamera /> Take / Choose Photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && (
        <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {original && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>ORIGINAL</h3>
            <img src={original} alt="Original" style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              {loading ? 'ENHANCING...' : enhanced ? '✨ ENHANCED' : 'RESULT'}
            </h3>
            {loading && (
              <div style={{ padding: 60, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                Processing...
              </div>
            )}
            {enhanced && (
              <img src={enhanced} alt="Enhanced" style={{ width: '100%', borderRadius: 12, border: '2px solid var(--accent)' }} />
            )}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>AI Suggestions</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestions.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: '0.9rem' }}>
                <FiCheck style={{ color: 'var(--accent)' }} /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {enhanced && (
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="ks-btn ks-btn-primary" onClick={download}>
            <FiDownload /> Download Enhanced
          </button>
          <button className="ks-btn ks-btn-secondary" onClick={() => { setOriginal(null); setEnhanced(null); setSuggestions([]); }}>
            <FiX /> Start Over
          </button>
        </div>
      )}
    </div>
  );
}
