import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload } from "react-icons/fi";
import { addProduct } from '../utils/productStore';

const STEPS = [
  { num: 1, label: 'Craft Details' },
  { num: 2, label: 'AI Story' },
  { num: 3, label: 'Preview' },
];

export default function CreateProduct() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [published, setPublished] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: "", category: "", material: "", price: "", story: "",
    artisanName: "", location: "", image: ""
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      update("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const generateAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, material: form.material, craftType: form.category })
      });
      const data = await res.json();
      update("story", data.description || `${form.name} - A beautiful handcrafted piece made with ${form.material}.`);
    } catch {
      update("story", `${form.name} - A beautiful handcrafted piece made with ${form.material}, representing India's rich artisan heritage.`);
    }
    setGenerating(false);
    setStep(2);
  };

  const publish = () => {
    // Save via productStore → admin panel will see it as "pending"
    addProduct({
      name: form.name || 'Untitled Craft',
      description: form.story,
      price: Number(form.price) || 0,
      image: form.image || 'https://via.placeholder.com/400',
      artisan: form.artisanName,
      location: form.location,
      category: form.category || 'Handicraft',
      material: form.material,
      status: 'pending',
    });
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setForm({ name: "", category: "", material: "", price: "", story: "", artisanName: "", location: "", image: "" });
      setImagePreview(null);
      setStep(1);
    }, 3000);
  };

  return (
    <div className="ks-page ks-create-page">
      {/* Header */}
      <span className="ks-eyebrow">Sell with KalaSetu</span>
      <h1>Tell the world your story</h1>
      <p>Add your craft once. Let AI help transform your craftsmanship into a story customers around the world can understand.</p>

      {/* ---------- STEP INDICATORS ---------- */}
      <div className="ks-steps">
        {STEPS.map((s, i) => (
          <div
            key={s.num}
            className={`ks-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}
          >
            <span className="ks-step-num">
              {step > s.num ? <FiCheck size={14} /> : s.num}
            </span>
            <span className="ks-step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ---------- STEP 1: CRAFT DETAILS ---------- */}
      {step === 1 && (
        <div className="ks-form-card">
          <div className="ks-form-group">
            <label>Artisan Name *</label>
            <input
              type="text"
              value={form.artisanName}
              onChange={e => update("artisanName", e.target.value)}
              placeholder="e.g. Rajesh Kumar"
            />
          </div>

          <div className="ks-form-group">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => update("location", e.target.value)}
              placeholder="e.g. Jaipur, Rajasthan"
            />
          </div>

          <div className="ks-form-group">
            <label>Craft Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update("name", e.target.value)}
              placeholder="e.g. Handwoven Banarasi Dupatta"
            />
          </div>

          <div className="ks-form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => update("category", e.target.value)}
            >
              <option value="">Select category</option>
              {['Pottery','Textiles','Woodwork','Metalwork','Painting','Jewellery','Handicraft'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="ks-form-group">
            <label>Material</label>
            <input
              type="text"
              value={form.material}
              onChange={e => update("material", e.target.value)}
              placeholder="e.g. Pure Silk"
            />
          </div>

          <div className="ks-form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => update("price", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="ks-form-group">
            <label>Product Image</label>
            <label className="ks-upload-box" htmlFor="craft-image">
              <FiUpload size={28} />
              <span>Click to upload product image</span>
              <input
                id="craft-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="ks-image-preview" />
            )}
          </div>

          <div className="ks-form-group">
            <label>Tell us about your craft</label>
            <textarea
              rows={4}
              value={form.story}
              onChange={e => update("story", e.target.value)}
              placeholder="Describe how it is made, where the tradition comes from, what makes it special..."
            />
          </div>

          <div className="ks-form-actions">
            <button className="ks-btn-primary" onClick={generateAI} disabled={generating || !form.name}>
              {generating ? 'Generating...' : 'Continue'} <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* ---------- STEP 2: AI STORY ---------- */}
      {step === 2 && (
        <div className="ks-form-card">
          <h2>Your AI-generated story</h2>
          <textarea
            rows={6}
            value={form.story}
            onChange={e => update("story", e.target.value)}
          />
          <div className="ks-form-actions">
            <button className="ks-btn-secondary" onClick={() => setStep(1)}>
              <FiArrowLeft /> Back
            </button>
            <button className="ks-btn-primary" onClick={() => setStep(3)}>
              Continue <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* ---------- STEP 3: PREVIEW ---------- */}
      {step === 3 && (
        <div className="ks-form-card">
          <h2>Preview</h2>
          <div className="ks-preview">
            <img src={form.image || 'https://via.placeholder.com/400'} alt="" />
            <div>
              <h3>{form.name || 'Untitled Craft'}</h3>
              <p>By {form.artisanName || 'Anonymous'}</p>
              <p className="ks-preview-price">₹{form.price || 0}</p>
              <p>{form.story}</p>
            </div>
          </div>
          <div className="ks-form-actions">
            <button className="ks-btn-secondary" onClick={() => setStep(2)}>
              <FiArrowLeft /> Back
            </button>
            <button className="ks-btn-primary" onClick={publish} disabled={published}>
              {published ? '✓ Submitted for approval' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
