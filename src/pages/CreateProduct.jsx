import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

export default function CreateProduct() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    category: "", 
    material: "", 
    price: "", 
    story: "" 
  });

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const generateAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: form.name, 
          material: form.material, 
          craftType: form.category 
        })
      });
      const data = await res.json();
      update("story", data.description || `${form.name} - A beautiful handcrafted piece made with ${form.material}.`);
    } catch (error) {
      update("story", `${form.name} - A beautiful handcrafted piece made with ${form.material}, representing India's rich artisan heritage.`);
    }
    setGenerating(false);
    setStep(2);
  };

  const publish = async () => {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          material: form.material,
          craftType: form.category,
          price: Number(form.price),
          description: form.story,
          tags: "handmade, indian, artisan",
          category: form.category || "Handmade Craft",
          artisanStory: form.story
        })
      });
      setPublished(true);
    } catch (error) {
      alert('Failed to publish. Please try again.');
    }
  };

  if (published) {
    return (
      <main className="ks-create">
        <div className="ks-container">
          <div className="ks-success">
            <div className="ks-success-icon">
              <FiCheck size={34} />
            </div>
            <h2>Your craft is now live ✨</h2>
            <p>Your creation has been added to the KalaSetu marketplace.</p>
            <button 
              className="ks-btn ks-btn-primary" 
              onClick={() => { 
                setPublished(false); 
                setStep(1); 
                setForm({ name: "", category: "", material: "", price: "", story: "" });
              }}
            >
              Add another craft
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ks-create">
      <div className="ks-container">
        <div className="ks-create-header">
          <span className="ks-eyebrow">Sell with KalaSetu</span>
          <h1>Tell the world your story.</h1>
          <p>
            Add your craft once. Let AI help transform your craftsmanship 
            into a story customers around the world can understand.
          </p>
        </div>

        {/* STEPPER */}
        <div className="ks-stepper">
          {[1, 2, 3].map((item, index) => (
            <div key={item} className={`ks-step ${step >= item ? "active" : ""}`}>
              <div className="ks-step-number">
                {step > item ? <FiCheck /> : item}
              </div>
              <span className="ks-step-label">
                {item === 1 && "Craft Details"}
                {item === 2 && "AI Story"}
                {item === 3 && "Preview"}
              </span>
              {index < 2 && <div className="ks-step-line" />}
            </div>
          ))}
        </div>

        <div className="ks-form-card">
          {step === 1 && (
            <>
              <div className="ks-form-grid">
                <div className="ks-form-group">
                  <label className="ks-form-label">Craft name</label>
                  <input 
                    className="ks-input" 
                    value={form.name} 
                    onChange={(e) => update("name", e.target.value)} 
                    placeholder="e.g. Handwoven Banarasi Dupatta" 
                    required 
                  />
                </div>

                <div className="ks-form-group">
                  <label className="ks-form-label">Category</label>
                  <select 
                    className="ks-select" 
                    value={form.category} 
                    onChange={(e) => update("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option>Textiles</option>
                    <option>Pottery</option>
                    <option>Jewellery</option>
                    <option>Woodcraft</option>
                    <option>Paintings</option>
                    <option>Home Decor</option>
                  </select>
                </div>

                <div className="ks-form-group">
                  <label className="ks-form-label">Material</label>
                  <input 
                    className="ks-input" 
                    value={form.material} 
                    onChange={(e) => update("material", e.target.value)} 
                    placeholder="e.g. Pure silk" 
                  />
                </div>

                <div className="ks-form-group">
                  <label className="ks-form-label">Price</label>
                  <input 
                    className="ks-input" 
                    type="number" 
                    value={form.price} 
                    onChange={(e) => update("price", e.target.value)} 
                    placeholder="₹ 0" 
                  />
                </div>

                <div className="ks-form-group full">
                  <label className="ks-form-label">Tell us about your craft</label>
                  <textarea 
                    className="ks-textarea" 
                    value={form.story} 
                    onChange={(e) => update("story", e.target.value)} 
                    placeholder="Describe how it is made, where the tradition comes from, what makes it special..." 
                  />
                </div>
              </div>

              <div className="ks-ai-box">
                <div className="ks-ai-header">
                  <div className="ks-ai-title">
                    ✨ AI Story Assistant
                  </div>
                  <button 
                    className="ks-btn ks-btn-primary" 
                    onClick={generateAI} 
                    disabled={generating}
                  >
                    {generating ? "Creating..." : "Generate with AI"}
                  </button>
                </div>
                <p className="ks-ai-description">
                  KalaSetu AI turns your craft details into a compelling 
                  marketplace description designed for global customers.
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Your AI-generated story</h2>
              <textarea 
                className="ks-textarea" 
                value={form.story} 
                onChange={(e) => update("story", e.target.value)} 
              />
              <div className="ks-form-actions">
                <button 
                  className="ks-btn ks-btn-secondary" 
                  onClick={() => setStep(1)}
                >
                  <FiArrowLeft /> Back
                </button>
                <button 
                  className="ks-btn ks-btn-primary" 
                  onClick={() => setStep(3)}
                >
                  Preview <FiArrowRight />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="ks-product-category">
                {form.category || "Craft"}
              </span>
              <h2>{form.name || "Untitled Craft"}</h2>
              <p>{form.material}</p>
              <p className="ks-product-ai">{form.story}</p>
              <h2>₹{form.price || "0"}</h2>
              <div className="ks-form-actions">
                <button 
                  className="ks-btn ks-btn-secondary" 
                  onClick={() => setStep(2)}
                >
                  <FiArrowLeft /> Back
                </button>
                <button 
                  className="ks-btn ks-btn-primary" 
                  onClick={publish}
                >
                  <FiCheck /> Publish Craft
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}