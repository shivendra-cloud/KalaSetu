import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { name, material, craftType } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are KalaSetu AI, an expert e-commerce copywriter for Indian handmade crafts. Write in warm, engaging English that appeals to global customers while respecting Indian heritage." 
        },
        { 
          role: "user", 
          content: `Generate a product description (2 sentences), 3 SEO tags (comma separated), and a category (e.g., Home Decor, Fashion, Jewelry, Art, Kitchen & Dining) for a handmade Indian craft. Name: ${name}, Material: ${material}, Craft: ${craftType}. Return strictly as JSON: {"description":"...", "tags":"tag1, tag2, tag3", "category":"..."}` 
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: "AI generation failed" });
  }
}
