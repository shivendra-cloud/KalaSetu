import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.article 
      className="ks-product-card" 
      initial={{ opacity: 0, y: 25 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.15 }} 
      transition={{ duration: 0.45 }}
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="ks-product-image">
        <button className="ks-wishlist" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} aria-label="wishlist">
          <FiHeart fill={liked ? "currentColor" : "none"} />
        </button>

        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" />
            <path d="M20 40C24 26 28 22 32 22C36 22 40 26 44 40" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}

        <div className="ks-product-overlay">
          <button className="ks-quick-view" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
            <FiEye /> Quick view
          </button>
        </div>
      </div>

      <div className="ks-product-info">
        <span className="ks-product-category">{product.category}</span>
        <h3 className="ks-product-title">{product.name}</h3>
        <p className="ks-product-material">{product.material}</p>
        
        {product.artisanName && (
          <p style={{ fontSize: '0.8rem', color: '#8D8178', marginTop: '5px' }}>
            👤 {product.artisanName}
          </p>
        )}
        
        <p className="ks-product-ai">{product.description}</p>
        <div className="ks-product-footer">
          <div>
            <div className="ks-price">₹{product.price}</div>
          </div>
          <button className="ks-add-cart" onClick={(e) => e.stopPropagation()} aria-label="add to cart">
            <FiShoppingBag />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
