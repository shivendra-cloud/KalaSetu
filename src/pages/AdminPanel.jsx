import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiRefreshCw, FiLock } from 'react-icons/fi';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_PASSWORD = 'kalasetu2026';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert('Invalid password!');
    }
  };

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
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="ks-container" style={{ padding: '4rem 0', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            <FiLock color="white" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', color: '#2D3748' }}>Admin Access</h2>
          <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Enter the admin password to manage crafts
          </p>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '1rem',
              marginBottom: '1rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
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
          <h1 style={{ fontSize: '2.5rem', margin: '10px 0 0', color: '#2D3748' }}>Manage Crafts</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="ks-btn ks-btn-secondary" onClick={fetchProducts}>
            <FiRefreshCw /> Refresh
          </button>
          <button 
            className="ks-btn ks-btn-secondary" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF9933' }}>{products.filter(p => p.status === 'pending').length}</div>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Pending</div>
        </div>
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d52' }}>{products.filter(p => p.status === 'approved').length}</div>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Approved</div>
        </div>
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c0392b' }}>{products.filter(p => p.status === 'rejected').length}</div>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Rejected</div>
        </div>
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>{products.length}</div>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Total</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="ks-filter-chips" style={{ marginBottom: '2rem' }}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            className={`ks-filter-chip ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'pending' && ` (${products.filter(p => p.status === 'pending').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="ks-skeleton" style={{ width: '200px', height: '30px', margin: '0 auto' }} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#2D3748' }}>No products found</h3>
          <p style={{ color: '#718096' }}>
            {filter === 'all' ? 'No products yet' : `No ${filter} products`}
          </p>
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
              border: '1px solid #E2E8F0',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: '#2D3748' }}>{product.name}</h3>
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
                <p style={{ color: '#4A5568', margin: '0 0 5px', fontSize: '0.9rem' }}>
                  <strong>{product.category}</strong> • {product.material} • <strong>₹{product.price}</strong>
                </p>
                {product.description && (
                  <p style={{ color: '#718096', margin: '0 0 5px', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    "{product.description.substring(0, 100)}..."
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.status === 'pending' && (
                  <>
                    <button
                      className="ks-btn"
                      style={{ background: '#2e7d52', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() => handleApprove(product._id)}
                      title="Approve"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      className="ks-btn"
                      style={{ background: '#b7791f', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() => handleReject(product._id)}
                      title="Reject"
                    >
                      <FiX /> Reject
                    </button>
                  </>
                )}
                {product.status === 'approved' && (
                  <button
                    className="ks-btn"
                    style={{ background: '#c0392b', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => handleDelete(product._id)}
                    title="Delete"
                  >
                    <FiTrash2 /> Delete
                  </button>
                )}
                {product.status === 'rejected' && (
                  <>
                    <button
                      className="ks-btn"
                      style={{ background: '#2e7d52', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() => handleApprove(product._id)}
                      title="Approve"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      className="ks-btn"
                      style={{ background: '#c0392b', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </>
                )}
                {product.status !== 'pending' && product.status !== 'approved' && product.status !== 'rejected' && (
                  <button
                    className="ks-btn"
                    style={{ background: '#c0392b', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => handleDelete(product._id)}
                    title="Delete"
                  >
                    <FiTrash2 /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
