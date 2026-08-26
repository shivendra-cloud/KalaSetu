import mongoose from 'mongoose';
import cors from 'cors';

const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
});

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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors());
  await mongoose.connect(process.env.MONGODB_URI);

  if (req.method === 'POST') {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } 
  else if (req.method === 'GET') {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } 
  else {
    res.status(405).end();
  }
}
