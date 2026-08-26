import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
}

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
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await dbConnect();

    if (req.method === 'POST') {
      const product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
    } 
    else if (req.method === 'GET') {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.status(200).json(products);
    } 
    else {
      return res.status(405).end();
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ 
      error: error.message,
      hint: 'Check if MONGODB_URI is set correctly'
    });
  }
}
