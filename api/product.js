// GET /api/product?id=1
const products = require('./products-data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const id = req.query.id;
  const p = products.find(x => x._id === id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(p);
};
