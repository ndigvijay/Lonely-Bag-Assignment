import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    validateCart 
  } = useCart();
  
  const [validatedCart, setValidatedCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cartItems.length > 0) {
      handleValidateCart();
    }
  }, [cartItems]);

  const handleValidateCart = async () => {
    setLoading(true);
    try {
      const result = await validateCart();
      if (result.success) {
        setValidatedCart(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to validate cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      setValidatedCart(null);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <div className="page-header">
          <h1>🛒 Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header">
                <h2>📦 Cart Items ({cartItems.length})</h2>
                <button 
                  onClick={handleClearCart}
                  className="btn btn-danger btn-small"
                >
                  Clear Cart
                </button>
              </div>

              <div className="items-list">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <Link 
                        to={`/products/${item._id}`} 
                        className="item-name"
                      >
                        {item.name}
                      </Link>
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="item-quantity">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="quantity-btn"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <small className="stock-info">
                        {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                      </small>
                    </div>

                    <div className="item-total">
                      <span className="total-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="item-actions">
                      <button 
                        onClick={() => handleRemoveItem(item._id)}
                        className="btn btn-danger btn-small"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-card">
                <h3>📋 Order Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-line">
                    <span>Items ({cartItems.length}):</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-line">
                    <span>Shipping:</span>
                    <span>
                      {getCartTotal() >= 50 ? 'FREE' : '$5.99'}
                    </span>
                  </div>
                  
                  <div className="summary-line">
                    <span>Tax (estimated):</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="summary-line total">
                    <span>Total:</span>
                    <span>
                      ${(
                        getCartTotal() + 
                        (getCartTotal() >= 50 ? 0 : 5.99) + 
                        (getCartTotal() * 0.08)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {getCartTotal() < 50 && (
                  <div className="shipping-notice">
                    💡 Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
                  </div>
                )}

                <div className="summary-actions">
                  <button 
                    onClick={handleCheckout}
                    className="btn btn-success checkout-btn"
                    disabled={loading}
                  >
                    {isAuthenticated ? '💳 Proceed to Checkout' : '🔐 Login to Checkout'}
                  </button>
                  
                  <Link to="/products" className="btn btn-secondary">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Validation Results */}
              {validatedCart && (
                <div className="validation-card">
                  <h4>✅ Cart Validation</h4>
                  <div className="validation-details">
                    <p><strong>Total Items:</strong> {validatedCart.itemCount}</p>
                    <p><strong>Validated Total:</strong> ${validatedCart.totalAmount.toFixed(2)}</p>
                    {validatedCart.items.some(item => item.quantity !== cartItems.find(ci => ci._id === item.productId)?.quantity) && (
                      <div className="validation-warning">
                        ⚠️ Some quantities were adjusted due to stock availability
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {cartItems.length > 0 && (
          <div className="recommendations">
            <h3>💡 You might also like</h3>
            <div className="recommendations-grid">
              <Link to="/products?category=Electronics" className="recommendation-card">
                <span>🔌 Electronics</span>
              </Link>
              <Link to="/products?category=Clothing" className="recommendation-card">
                <span>👕 Clothing</span>
              </Link>
              <Link to="/products?category=Home" className="recommendation-card">
                <span>🏠 Home & Garden</span>
              </Link>
              <Link to="/products?category=Fitness" className="recommendation-card">
                <span>💪 Fitness</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 