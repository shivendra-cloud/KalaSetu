// Voice Cataloger — accepts audio, returns SEO description in EN + HI
// Requires OPENAI_API_KEY env var on Vercel

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Graceful fallback: return a placeholder using the client-supplied transcript
    const { fallbackText } = req.body || {};
    return res.status(200).json({
      transcript: fallbackText || '',
      title: 'Handmade Craft',
      description_en: fallbackText
        ? `${fallbackText.slice(0, 120)}...`
        : 'Beautiful handmade craft from India.',
      description_hi: 'भारत से सुंदर हस्तनिर्मित शिल्प।',
      tags: ['handmade', 'india', 'craft', 'artisan', 'traditional'],
      note: 'Set OPENAI_API_KEY in Vercel env vars for full AI.'
    });
  }

  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'hi' } = req.body;
    if (!audioBase64) return res.status(400).json({ error: 'audioBase64 required' });

    const buffer = Buffer.from(audioBase64, 'base64');
    const OpenAI = require('openai');
    const client = new OpenAI({ apiKey: key });

    // Whisper transcription
    const file = new File([buffer], 'audio.webm', { type: mimeType });
    const tr = await client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language,
    });
    const transcript = tr.text || '';

    // GPT: generate SEO listing
    const prompt = `You are an e-commerce copywriter for Indian handicrafts.
An artisan described their product in ${language}: "${transcript}"

Return ONLY valid JSON with these keys:
- title: short product title (max 60 chars)
- description_en: SEO-friendly English description (40-60 words)
- description_hi: same description translated to natural Hindi
- tags: array of 5-6 keywords
- category: one of Pottery, Textiles, Woodwork, Metalwork, Painting, Jewellery, Handicraft
- material: primary raw material`;

    const gpt = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });
    const data = JSON.parse(gpt.choices[0].message.content);

    res.status(200).json({ transcript, ...data });
  } catch (err) {
    console.error('Transcribe error:', err);
    res.status(500).json({ error: err.message });
  }
};
