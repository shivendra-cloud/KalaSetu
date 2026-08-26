import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'All' || p.category === category)
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Simple Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px',
          margin: '0 auto 1rem',
          background: 'linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
        }}>
          {/* Same bridge logo */}
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            <path d="M3 18V12C3 10 5 8 7 8C9 8 10 10 12 10C14 10 15 8 17 8C19 8 21 10 21 12V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="1.5" fill="white"/>
          </svg>
        </div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#2D3748',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          KalaSetu Marketplace
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Bridging Indian Artisans to Global Markets
        </p>
      </div>

      {/* Search */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <input 
          placeholder="Search crafts..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <select 
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '1rem',
            background: 'white'
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          Loading crafts...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
          <h3>No Crafts Found</h3>
          <p style={{ color: '#718096' }}>Be the first to list yours on KalaSetu!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredProducts.map(p => (
            <div key={p._id} style={{ 
              border: '1px solid #E2E8F0', 
              borderRadius: '12px', 
              padding: '1.5rem',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                background: '#FFF8F0',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#FF9933',
                fontWeight: '600'
              }}>
                {p.category || 'Handmade Craft'}
              </div>
              <h3 style={{ color: '#2D3748', marginBottom: '0.5rem' }}>{p.name}</h3>
              <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
                <strong>Material:</strong> {p.material}
              </p>
              <p style={{ color: '#FF9933', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ₹{p.price}
              </p>
              <p style={{ color: '#2D3748', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                "{p.description}"
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.tags?.split(',').map(tag => (
                  <span key={tag} style={{ 
                    background: '#FFF8F0', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#FF9933'
                  }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}