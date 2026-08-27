import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiRefreshCw } from 'react-icons/fi';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        headers: { 'x-admin': 'true' }
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'approved' })
    });
    fetchProducts();
  };

  const handleReject = async (id) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'rejected' })
    });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#2e7d52';
      case 'pending': return '#b7791f';
      case 'rejected': return '#c0392b';
      default: return '#718096';
    }
  };

  return (
    <div className="ks-container" style={{ padding: '2rem 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="ks-eyebrow">Admin Panel</span>
          <h1 style={{ fontSize: '2.5rem', margin: '10px 0 0' }}>Manage Crafts</h1>
        </div>
        <button className="ks-btn ks-btn-secondary" onClick={fetchProducts}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="ks-filter-chips" style={{ marginBottom: '2rem' }}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            className={`ks-filter-chip ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3>No products found</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredProducts.map(product => (
            <div key={product._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{product.name}</h3>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: getStatusColor(product.status) + '20',
                    color: getStatusColor(product.status),
                    textTransform: 'uppercase'
                  }}>
                    {product.status}
                  </span>
                </div>
                <p style={{ color: '#718096', margin: '0 0 5px', fontSize: '0.9rem' }}>
                  {product.category} • {product.material} • ₹{product.price}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.status !== 'approved' && (
                  <button
                    className="ks-btn"
                    style={{ background: '#2e7d52', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => handleApprove(product._id)}
                  >
                    <FiCheck /> Approve
                  </button>
                )}
                {product.status !== 'rejected' && (
                  <button
                    className="ks-btn"
                    style={{ background: '#b7791f', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => handleReject(product._id)}
                  >
                    <FiX /> Reject
                  </button>
                )}
                <button
                  className="ks-btn"
                  style={{ background: '#c0392b', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                  onClick={() => handleDelete(product._id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
