import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setAddToCartMessage(`✅ ${quantity} item(s) added to cart!`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    } else {
      setAddToCartMessage(`❌ ${result.message}`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      setAddToCartMessage(`❌ ${result.message}`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>😞 Oops!</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Go Back
            </button>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Products</Link>
          <span>›</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-content">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <span className="product-category">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price-section">
                <span className="product-price">${product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="product-description">
              <h3>📝 Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-details">
              <h3>📋 Product Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{product.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stock Status:</span>
                  <span className={`detail-value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Product ID:</span>
                  <span className="detail-value">{product._id}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="add-to-cart-section">
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button 
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="btn btn-primary add-to-cart-btn"
                    >
                      {cartLoading ? 'Adding...' : `🛒 Add ${quantity} to Cart`}
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      disabled={cartLoading}
                      className="btn btn-success buy-now-btn"
                    >
                      💳 Buy Now
                    </button>
                  </div>

                  {addToCartMessage && (
                    <div className={`cart-message ${addToCartMessage.includes('✅') ? 'success' : 'error'}`}>
                      {addToCartMessage}
                    </div>
                  )}
                </>
              ) : (
                <div className="out-of-stock-section">
                  <p className="out-of-stock-message">😞 This product is currently out of stock</p>
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <Link to="/products" className="btn btn-secondary">
                ← Continue Shopping
              </Link>
              <Link to="/cart" className="btn btn-primary">
                🛒 View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="additional-info">
          <div className="info-tabs">
            <div className="info-tab active">
              <h3>📦 Shipping Information</h3>
              <div className="info-content">
                <ul>
                  <li>✅ Free shipping on orders over $50</li>
                  <li>🚚 Standard delivery: 3-5 business days</li>
                  <li>⚡ Express delivery: 1-2 business days (additional charges apply)</li>
                  <li>📍 We ship nationwide</li>
                </ul>
              </div>
            </div>

            <div className="info-tab">
              <h3>↩️ Return Policy</h3>
              <div className="info-content">
                <ul>
                  <li>✅ 30-day return policy</li>
                  <li>📦 Items must be in original condition</li>
                  <li>💰 Full refund if returned within 30 days</li>
                  <li>🆓 Free returns for defective items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 