import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://Admin:Admin123@kalasetu-cluster.mpljkgp.mongodb.net/kalasetu?appName=kalasetu-cluster';

const productSchema = new mongoose.Schema({
  name: String,
  material: String,
  craftType: String,
  price: Number,
  description: String,
  tags: String,
  category: String,
  artisanStory: String,
  artisanName: String,
  location: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await dbConnect();

    // Check for admin query parameter
    const isAdmin = req.headers['x-admin'] === 'true';

    if (req.method === 'POST') {
      const product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
    } 
    else if (req.method === 'GET') {
      if (isAdmin) {
        // Admin: get ALL products
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.status(200).json(products);
      } else {
        // Public: only approved products
        const products = await Product.find({ status: 'approved' }).sort({ createdAt: -1 });
        return res.status(200).json(products);
      }
    } 
    else if (req.method === 'PUT') {
      const { id, status } = req.body;
      const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
      return res.status(200).json(product);
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.body;
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Product deleted' });
    } 
    else {
      return res.status(405).end();
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
