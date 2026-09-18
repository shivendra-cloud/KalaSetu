// Product store — works offline / without MongoDB
// Merges: mock products + localStorage user-added products

const STORAGE_KEY = 'kalasetu_admin_products';

const MOCK = [
  { _id: 'm1', name: 'Blue Pottery Vase', description: 'Handmade blue pottery vase from Jaipur', price: 1200, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', artisan: 'Ramesh Kumar', category: 'Pottery', material: 'Clay' },
  { _id: 'm2', name: 'Handwoven Silk Saree', description: 'Pure Banarasi silk saree', price: 5500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', artisan: 'Sita Devi', category: 'Textiles', material: 'Silk' },
  { _id: 'm3', name: 'Wooden Handicraft Box', description: 'Carved sheesham wood box', price: 800, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500', artisan: 'Mohan Lal', category: 'Woodwork', material: 'Wood' },
];

export function getLocalProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveLocalProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addLocalProduct(product) {
  const list = getLocalProducts();
  const withId = { ...product, _id: `local_${Date.now()}`, createdAt: new Date().toISOString() };
  list.unshift(withId);
  saveLocalProducts(list);
  return withId;
}

export function deleteLocalProduct(id) {
  const list = getLocalProducts().filter(p => p._id !== id);
  saveLocalProducts(list);
}

export function getAllProducts() {
  return [...getLocalProducts(), ...MOCK];
}
