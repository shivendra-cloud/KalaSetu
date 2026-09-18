// Product store — localStorage-backed with status workflow
const STORAGE_KEY = 'kalasetu_products_v2';

const MOCK = [
  { _id: 'm1', name: 'Blue Pottery Vase', description: 'Handmade blue pottery vase from Jaipur', price: 1200, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', artisan: 'Ramesh Kumar', category: 'Pottery', material: 'Clay', status: 'approved', createdAt: '2026-01-01' },
  { _id: 'm2', name: 'Handwoven Silk Saree', description: 'Pure Banarasi silk saree', price: 5500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', artisan: 'Sita Devi', category: 'Textiles', material: 'Silk', status: 'approved', createdAt: '2026-01-02' },
  { _id: 'm3', name: 'Wooden Handicraft Box', description: 'Carved sheesham wood box', price: 800, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500', artisan: 'Mohan Lal', category: 'Woodwork', material: 'Wood', status: 'approved', createdAt: '2026-01-03' },
];

export function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAll(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

// All products = mock (approved) + user-added
export function getAll() {
  return [...loadAll(), ...MOCK];
}

// Only approved products (for customer-facing site)
export function getApproved() {
  const local = loadAll().filter(p => p.status === 'approved');
  return [...local, ...MOCK];
}

// Only pending/rejected (for admin)
export function getByStatus(status) {
  return loadAll().filter(p => p.status === status);
}

export function addProduct(product) {
  const list = loadAll();
  const item = {
    ...product,
    _id: 'local_' + Date.now(),
    status: product.status || 'pending',
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  saveAll(list); try { window.dispatchEvent(new Event("kalasetu-products-updated")); } catch {}
  return item;
}

export function updateStatus(id, status) {
  const list = loadAll();
  const idx = list.findIndex(p => p._id === id);
  if (idx === -1) return null;
  list[idx].status = status;
  saveAll(list); try { window.dispatchEvent(new Event("kalasetu-products-updated")); } catch {}
  return list[idx];
}

export function updateProduct(id, patch) {
  const list = loadAll();
  const idx = list.findIndex(p => p._id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  saveAll(list); try { window.dispatchEvent(new Event("kalasetu-products-updated")); } catch {}
  return list[idx];
}

export function deleteProduct(id) {
  const list = loadAll().filter(p => p._id !== id);
  saveAll(list); try { window.dispatchEvent(new Event("kalasetu-products-updated")); } catch {}
}

export function seedDemoData() {
  // Add a pending product for demo if user hasn't added any
  if (loadAll().length === 0) {
    addProduct({
      name: 'Terracotta Jewellery Set',
      description: 'Handmade terracotta necklace with earrings',
      price: 450,
      category: 'Jewellery',
      material: 'Terracotta',
      artisan: 'Kavita Sharma',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
      status: 'pending',
    });
    addProduct({
      name: 'Madhubani Painting',
      description: 'Traditional Madhubani art on handmade paper',
      price: 3200,
      category: 'Painting',
      material: 'Paper',
      artisan: 'Anita Jha',
      image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500',
      status: 'pending',
    });
  }
}

// Notify listeners (ProductGrid, etc.) when products change
function notify() {
  try {
    window.dispatchEvent(new Event('kalasetu-products-updated'));
  } catch {}
}

// Wrap mutators to call notify
const _saveAll = saveAll;
export function saveAllAndNotify(list) {
  _saveAll(list); try { window.dispatchEvent(new Event("kalasetu-products-updated")); } catch {}
  notify();
}
