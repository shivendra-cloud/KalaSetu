const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  {
    _id: '1',
    title: 'Blue Pottery Vase',
    title_hi: 'नीला मिट्टी का फूलदान',
    title_mr: 'निळा मातीचा फुलदाणी',
    description: 'Handmade blue pottery vase from Jaipur',
    description_hi: 'जयपुर से हस्तनिर्मित नीला मिट्टी का फूलदान',
    description_mr: 'जयपूरहून हस्तनिर्मित निळा मातीचा फुलदाणी',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
    artisan: 'Ramesh Kumar',
    category: 'Pottery'
  },
  {
    _id: '2',
    title: 'Handwoven Silk Saree',
    title_hi: 'हाथ से बुनी रेशमी साड़ी',
    title_mr: 'हातमाग रेशमी साडी',
    description: 'Pure Banarasi silk saree, handwoven',
    description_hi: 'शुद्ध बनारसी रेशमी साड़ी, हाथ से बुनी',
    description_mr: 'शुद्ध बनारसी रेशमी साडी, हातमाग',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
    artisan: 'Sita Devi',
    category: 'Textiles'
  },
  {
    _id: '3',
    title: 'Wooden Handicraft Box',
    title_hi: 'लकड़ी का हस्तशिल्प बॉक्स',
    title_mr: 'लाकडी हस्तकला पेटी',
    description: 'Carved sheesham wood jewellery box',
    description_hi: 'नक्काशीदार शीशम लकड़ी की ज्वेलरी बॉक्स',
    description_mr: 'कोरीव शिसम लाकडी दागिन्यांचा डबा',
    price: 800,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500',
    artisan: 'Mohan Lal',
    category: 'Woodwork'
  },
  {
    _id: '4',
    title: 'Brass Diya Set',
    title_hi: 'पीतल दीया सेट',
    title_mr: 'पितळी दिवा संच',
    description: 'Traditional brass diyas, set of 5',
    description_hi: 'पारंपरिक पीतल दीये, 5 का सेट',
    description_mr: 'पारंपारिक पितळी दिवे, 5 चा संच',
    price: 650,
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a0a1c1?w=500',
    artisan: 'Lakshmi Bai',
    category: 'Metalwork'
  },
  {
    _id: '5',
    title: 'Madhubani Painting',
    title_hi: 'मधुबनी पेंटिंग',
    title_mr: 'मधुबनी चित्रकला',
    description: 'Traditional Madhubani art on handmade paper',
    description_hi: 'हस्तनिर्मित कागज़ पर पारंपरिक मधुबनी कला',
    description_mr: 'हस्तनिर्मित कागदावर पारंपारिक मधुबनी कला',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500',
    artisan: 'Anita Jha',
    category: 'Painting'
  },
  {
    _id: '6',
    title: 'Terracotta Jewellery',
    title_hi: 'टेराकोटा आभूषण',
    title_mr: 'टेराकोटा दागिने',
    description: 'Handcrafted terracotta necklace set',
    description_hi: 'हस्तनिर्मित टेराकोटा हार सेट',
    description_mr: 'हस्तनिर्मित टेराकोटा हार संच',
    price: 450,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    artisan: 'Kavita Sharma',
    category: 'Jewellery'
  }
];

app.get('/', (req, res) => res.send('✅ KalaSetu Backend running! Try /api/products'));
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => x._id === req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Backend running at http://localhost:${PORT}`));
