import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiShoppingBag } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="ks-container" style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="ks-skeleton" style={{ width: '200px', height: '30px', margin: '0 auto' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ks-container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="ks-btn ks-btn-primary" style={{ marginTop: '1rem' }}>
          <FiArrowLeft /> Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="ks-container" style={{ padding: '2rem 0' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#FF9933', fontWeight: '600', marginBottom: '2rem' }}>
        <FiArrowLeft /> Back to Marketplace
      </Link>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem',
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {/* Image Section */}
        <div style={{ 
          borderRadius: '15px', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffe2c1, #f3b47a)',
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ fontSize: '5rem' }}>🎨</div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <span className="ks-product-category">{product.category}</span>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '1rem 0',
            fontFamily: 'Playfair Display, serif',
            color: '#2D3748'
          }}>
            {product.name}
          </h1>

          {product.artisanName && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '1rem',
              padding: '10px 15px',
              background: '#FFF8F0',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <div>
                <strong style={{ color: '#2D3748' }}>{product.artisanName}</strong>
                {product.location && (
                  <div style={{ color: '#718096', fontSize: '0.85rem' }}>
                    📍 {product.location}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '10px 15px', 
              background: '#F7FAFC', 
              borderRadius: '10px',
              flex: 1,
              minWidth: '120px'
            }}>
              <div style={{ color: '#718096', fontSize: '0.8rem' }}>Material</div>
              <strong style={{ color: '#2D3748' }}>{product.material}</strong>
            </div>
            <div style={{ 
              padding: '10px 15px', 
              background: '#F7FAFC', 
              borderRadius: '10px',
              flex: 1,
              minWidth: '120px'
            }}>
              <div style={{ color: '#718096', fontSize: '0.8rem' }}>Craft Type</div>
              <strong style={{ color: '#2D3748' }}>{product.craftType}</strong>
            </div>
          </div>

          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#FF9933',
            marginBottom: '1.5rem'
          }}>
            ₹{product.price}
          </div>

          <div style={{ 
            background: '#FFF8F0', 
            padding: '1.5rem', 
            borderRadius: '15px',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#2D3748', marginBottom: '0.5rem' }}>📖 Product Story</h3>
            <p style={{ color: '#4A5568', lineHeight: '1.7' }}>{product.description || product.artisanStory}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="ks-btn ks-btn-primary" style={{ flex: 1 }}>
              <FiShoppingBag /> Add to Cart
            </button>
            <button className="ks-btn ks-btn-secondary">
              <FiHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
