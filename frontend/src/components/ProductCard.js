import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    await addToCart(product._id, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.stock === 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          
          <div className="product-footer">
            <div className="product-price">
              <span className="price">${product.price.toFixed(2)}</span>
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button 
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="btn btn-primary add-to-cart"
        >
          {loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <Link 
          to={`/products/${product._id}`}
          className="btn btn-secondary view-details"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 