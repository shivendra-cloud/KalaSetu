const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://Admin:Admin123@kalasetu-cluster.mpljkgp.mongodb.net/kalasetu?appName=kalasetu-cluster';
const ADMIN_PASSWORD = 'Admin123';

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  cachedDb = client.db('kalasetu');
  return cachedDb;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth check
  const pwd = req.headers['x-admin'] || req.query.password;
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await connectDB();
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(products);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id required' });
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'PUT') {
      const id = req.query.id;
      const update = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin API error:', err);
    res.status(500).json({ error: err.message });
  }
};
