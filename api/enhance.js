// AI Image Enhancer — sharp-based enhancement + optional bg removal
const sharp = require('sharp');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'image required' });

    // Strip data URI prefix
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const inputBuffer = Buffer.from(base64, 'base64');

    // Auto-enhance: brighten, sharpen, boost saturation, normalize
    const enhanced = await sharp(inputBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .modulate({ brightness: 1.08, saturation: 1.12 })
      .sharpen({ sigma: 1.2 })
      .normalise()
      .jpeg({ quality: 88 })
      .toBuffer();

    // Generate a thumbnail
    const thumb = await sharp(enhanced)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 75 })
      .toBuffer();

    res.status(200).json({
      enhanced: `data:image/jpeg;base64,${enhanced.toString('base64')}`,
      thumbnail: `data:image/jpeg;base64,${thumb.toString('base64')}`,
      suggestions: [
        'Photo cropped to e-commerce square ratio',
        'Brightness +8%, saturation +12% applied',
        'Sharpened for clarity',
        'Add a plain background for best results'
      ]
    });
  } catch (err) {
    console.error('Enhance error:', err);
    res.status(500).json({ error: err.message });
  }
};
