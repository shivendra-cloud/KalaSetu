// Dynamic Pricing Assistant — heuristic ML model
const BASE_PRICE = {
  Pottery: 800, Textiles: 2000, Woodwork: 1200,
  Metalwork: 1500, Jewellery: 500, Painting: 2500,
  Handicraft: 1000
};

const MATERIAL_MULT = {
  silk: 2.2, pashmina: 3.0, brass: 1.5, silver: 3.0,
  gold: 5.0, wood: 1.2, clay: 1.0, cotton: 1.0,
  wool: 1.4, copper: 1.3, terracotta: 0.9, bamboo: 0.8,
  jute: 0.7, paper: 0.8, canvas: 1.0
};

const COMPLEXITY = {
  handmade: 1.15, handwoven: 1.2, handpainted: 1.2,
  handcrafted: 1.15, embroidered: 1.35, carved: 1.3,
  traditional: 1.1, ancient: 1.25, heritage: 1.2
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { title = '', category = 'Handicraft', material = '' } = req.body || {};
  const text = `${title} ${material} ${category}`.toLowerCase();

  // Base by category
  let price = BASE_PRICE[category] || 1000;

  // Material multiplier
  let matMult = 1.0;
  for (const [k, v] of Object.entries(MATERIAL_MULT)) {
    if (text.includes(k)) matMult = Math.max(matMult, v);
  }

  // Complexity multiplier
  let compMult = 1.0;
  for (const [k, v] of Object.entries(COMPLEXITY)) {
    if (text.includes(k)) compMult = Math.max(compMult, v);
  }

  // Market trend (static for demo)
  const marketMult = 1.08;

  const suggested = Math.round(price * matMult * compMult * marketMult);
  const min = Math.round(suggested * 0.8);
  const max = Math.round(suggested * 1.25);
  const marketAvg = Math.round(suggested * 0.95);

  // Confidence scales with how many signals we matched
  let confidence = 0.55;
  if (matMult > 1.0) confidence += 0.15;
  if (compMult > 1.0) confidence += 0.15;
  if (BASE_PRICE[category]) confidence += 0.15;
  confidence = Math.min(confidence, 0.92);

  res.status(200).json({
    suggested, min, max, market_avg: marketAvg,
    confidence: parseFloat(confidence.toFixed(2)),
    breakdown: {
      base: price,
      materialMultiplier: matMult,
      complexityMultiplier: compMult,
      marketMultiplier: marketMult
    }
  });
};
