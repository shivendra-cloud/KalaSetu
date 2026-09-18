// Mock API — no MongoDB, always works
const products = [
  { _id: '1', name: 'Blue Pottery Vase', description: 'Handmade blue pottery vase from Jaipur', price: 1200, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', artisan: 'Ramesh Kumar', category: 'Pottery', material: 'Clay', tags: 'handmade,pottery,jaipur' },
  { _id: '2', name: 'Handwoven Silk Saree', description: 'Pure Banarasi silk saree', price: 5500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', artisan: 'Sita Devi', category: 'Textiles', material: 'Silk', tags: 'silk,saree,banarasi' },
  { _id: '3', name: 'Wooden Handicraft Box', description: 'Carved sheesham wood jewellery box', price: 800, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500', artisan: 'Mohan Lal', category: 'Woodwork', material: 'Wood', tags: 'wood,box,handmade' },
  { _id: '4', name: 'Brass Diya Set', description: 'Traditional brass diyas, set of 5', price: 650, image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a0a1c1?w=500', artisan: 'Lakshmi Bai', category: 'Metalwork', material: 'Brass', tags: 'brass,diya' },
  { _id: '5', name: 'Madhubani Painting', description: 'Traditional Madhubani art', price: 3200, image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500', artisan: 'Anita Jha', category: 'Painting', material: 'Paper', tags: 'madhubani,painting' },
  { _id: '6', name: 'Terracotta Jewellery', description: 'Handcrafted terracotta necklace', price: 450, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', artisan: 'Kavita Sharma', category: 'Jewellery', material: 'Terracotta', tags: 'terracotta,jewellery' },
  { _id: '7', name: 'Kashmiri Pashmina Shawl', description: 'Authentic hand-embroidered pashmina', price: 8500, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500', artisan: 'Fatima Begum', category: 'Textiles', material: 'Pashmina', tags: 'pashmina,shawl' },
  { _id: '8', name: 'Dhokra Tribal Art', description: 'Lost-wax brass casting figurine', price: 2800, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500', artisan: 'Budhan Murmu', category: 'Metalwork', material: 'Brass', tags: 'dhokra,tribal' },
  { _id: '9', name: 'Kalamkari Wall Art', description: 'Hand-painted Kalamkari', price: 1800, image: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500', artisan: 'Ravi Naidu', category: 'Painting', material: 'Cotton', tags: 'kalamkari' },
  { _id: '10', name: 'Bamboo Basket Set', description: 'Set of 3 handwoven bamboo baskets', price: 900, image: 'https://images.unsplash.com/photo-1595347097560-69238724e7bd?w=500', artisan: 'Lakhan Singh', category: 'Woodwork', material: 'Bamboo', tags: 'bamboo,basket' },
  { _id: '11', name: 'Bandhani Dupatta', description: 'Traditional tie-dye Bandhani', price: 1500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', artisan: 'Priya Patel', category: 'Textiles', material: 'Cotton', tags: 'bandhani' },
  { _id: '12', name: 'Bidri Silver Inlay', description: 'Bidriware vase with silver inlay', price: 4200, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', artisan: 'Abdul Rahman', category: 'Metalwork', material: 'Silver', tags: 'bidri,silver' }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.status(200).json(products);
};
