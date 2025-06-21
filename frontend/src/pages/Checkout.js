import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, getCartTotal, clearCart, validateCart } = useCart();
  
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    fetchCartSummary();
  }, [isAuthenticated, cartItems, navigate]);

  const fetchCartSummary = async () => {
    try {
      setLoading(true);
      const result = await validateCart();
      if (result.success) {
        setCartSummary(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      setError('Failed to load cart summary');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'street', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingAddress[field].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: calculateFinalTotal()
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success) {
        setOrderSuccess(response.data.data);
        clearCart();
        // Navigate to order confirmation after a short delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => getCartTotal();
  const calculateShipping = () => getCartTotal() >= 50 ? 0 : 5.99;
  const calculateTax = () => getCartTotal() * 0.08;
  const calculateFinalTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  if (orderSuccess) {
    return (
      <div className="container">
        <div className="order-success">
          <div className="success-icon">🎉</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          
          <div className="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {orderSuccess._id}</p>
            <p><strong>Total Amount:</strong> ${orderSuccess.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> <span className="badge badge-warning">Pending</span></p>
          </div>
          
          <div className="success-actions">
            <button 
              onClick={() => navigate('/orders')}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-page">
        <div className="page-header">
          <h1>💳 Checkout</h1>
          <p>Complete your order</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form">
            {/* Shipping Address */}
            <div className="checkout-section">
              <h2>🏠 Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className="form-control"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="form-control"
                    placeholder="(optional)"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="form-control"
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="form-control"
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="form-control"
                    placeholder="Enter state"
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="form-control"
                    placeholder="Enter ZIP code"
                  />
                </div>

                <div className="form-group">
                  <label>Country *</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="form-control"
                  >
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2>💳 Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <span className="payment-icon">💳</span>
                    <div>
                      <strong>Credit/Debit Card</strong>
                      <p>Secure payment with credit or debit card</p>
                    </div>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <span className="payment-icon">🅿️</span>
                    <div>
                      <strong>PayPal</strong>
                      <p>Pay securely with your PayPal account</p>
                    </div>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <span className="payment-icon">🍎</span>
                    <div>
                      <strong>Apple Pay</strong>
                      <p>Quick and secure payment with Apple Pay</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h2>📋 Order Summary</h2>
              
              <div className="order-items">
                <h3>Items ({cartItems.length})</h3>
                <div className="items-list">
                  {cartItems.map(item => (
                    <div key={item._id} className="summary-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-totals">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="total-line">
                  <span>Shipping:</span>
                  <span>
                    {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                <div className="total-line">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="total-line final-total">
                  <span>Total:</span>
                  <span>${calculateFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              {calculateShipping() === 0 && (
                <div className="free-shipping-notice">
                  🎉 You qualify for free shipping!
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn btn-success place-order-btn"
              >
                {loading ? 'Placing Order...' : `Place Order - $${calculateFinalTotal().toFixed(2)}`}
              </button>

              <div className="security-badges">
                <div className="security-item">
                  <span>🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="security-item">
                  <span>🛡️</span>
                  <span>Data Protection</span>
                </div>
                <div className="security-item">
                  <span>✅</span>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 