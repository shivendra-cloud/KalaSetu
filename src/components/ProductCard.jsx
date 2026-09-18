import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.article className="ks-product-card" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45 }}>
      <div className="ks-product-image">
        <button className="ks-wishlist" onClick={() => setLiked(!liked)} aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
          <FiHeart fill={liked ? "currentColor" : "none"} />
        </button>

        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" />
          <path d="M20 40C24 26 28 22 32 22C36 22 40 26 44 40" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="ks-product-overlay">
          <button className="ks-quick-view"><FiEye /> Quick view</button>
        </div>
      </div>

      <div className="ks-product-info">
        <span className="ks-product-category">{product.category}</span>
        <h3 className="ks-product-title">{product.name}</h3>
        <p className="ks-product-material">{product.material}</p>
        <p className="ks-product-ai">{product.description}</p>
        <div className="ks-product-footer">
          <div>
            <div className="ks-price">₹{product.price}</div>
            <div className="ks-rating">★ {product.rating}</div>
          </div>
          <button className="ks-add-cart" aria-label={`Add ${product.name} to cart`}><FiShoppingBag /></button>
        </div>
      </div>
    </motion.article>
  );
}