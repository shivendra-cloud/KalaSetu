import { useState, useRef } from 'react';
import { FiMic, FiSquare, FiCheck, FiCopy } from 'react-icons/fi';

const LANGS = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
];

export default function VoiceCataloger() {
  const [lang, setLang] = useState('hi');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudio(blob);
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch (err) {
      setError('Microphone access denied: ' + err.message);
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const sendAudio = async (blob) => {
    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const audioBase64 = e.target.result.split(',')[1];
        const r = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64, mimeType: 'audio/webm', language: lang })
        });
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        setResult(data);
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="ks-page" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 8 }}>
        🎙️ Voice Cataloger
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
        Describe your product in your language. AI writes a professional listing in English + Hindi.
      </p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Your language:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={lang === l.code ? 'ks-btn ks-btn-primary' : 'ks-btn ks-btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          style={{
            width: 120, height: 120, borderRadius: '50%',
            background: recording ? '#ef4444' : 'var(--accent)',
            color: '#fff', border: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42, cursor: 'pointer',
            boxShadow: `0 0 30px ${recording ? 'rgba(239,68,68,0.5)' : 'rgba(217,119,6,0.5)'}`,
            transition: 'all 0.2s'
          }}
        >
          {recording ? <FiSquare /> : <FiMic />}
        </button>
        <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>
          {loading ? 'Processing with AI...' : recording ? 'Recording... tap to stop' : 'Tap to speak'}
        </p>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 6 }}>
            You said
          </h3>
          <p style={{ marginBottom: 16, fontStyle: 'italic' }}>"{result.transcript}"</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h3 style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              English Listing
            </h3>
            <button onClick={() => copy(`${result.title}\n\n${result.description_en}`)} className="ks-btn ks-btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              <FiCopy /> Copy
            </button>
          </div>
          <p style={{ fontWeight: 700, marginBottom: 6 }}>{result.title}</p>
          <p style={{ marginBottom: 16 }}>{result.description_en}</p>

          <h3 style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 6 }}>
            हिंदी लिस्टिंग
          </h3>
          <p>{result.description_hi}</p>

          {result.tags && (
            <>
              <h3 style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>
                Tags
              </h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {result.tags.map((t, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: 'rgba(217,119,6,0.15)', color: 'var(--accent)', borderRadius: 12, fontSize: '0.8rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
