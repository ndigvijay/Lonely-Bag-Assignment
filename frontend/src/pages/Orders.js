import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setSelectedOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge badge-warning';
      case 'confirmed': return 'badge badge-info';
      case 'shipped': return 'badge badge-info';
      case 'delivered': return 'badge badge-success';
      case 'cancelled': return 'badge badge-danger';
      default: return 'badge badge-warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>🔐 Login Required</h2>
          <p>Please login to view your order history.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="orders-page">
        <div className="page-header">
          <h1>📦 My Orders</h1>
          <p>Track and manage your order history</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-content">
            {/* Filters */}
            <div className="orders-filters">
              <h3>🔍 Filter Orders</h3>
              <div className="filter-buttons">
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                >
                  All Orders ({orders.length})
                </button>
                <button 
                  onClick={() => setStatusFilter('pending')}
                  className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                >
                  ⏳ Pending ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button 
                  onClick={() => setStatusFilter('confirmed')}
                  className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
                >
                  ✅ Confirmed ({orders.filter(o => o.status === 'confirmed').length})
                </button>
                <button 
                  onClick={() => setStatusFilter('shipped')}
                  className={`filter-btn ${statusFilter === 'shipped' ? 'active' : ''}`}
                >
                  🚚 Shipped ({orders.filter(o => o.status === 'shipped').length})
                </button>
                <button 
                  onClick={() => setStatusFilter('delivered')}
                  className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`}
                >
                  📦 Delivered ({orders.filter(o => o.status === 'delivered').length})
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="orders-list">
              <h3>📋 Order History</h3>
              
              {filteredOrders.length === 0 ? (
                <div className="no-filtered-orders">
                  <p>No orders found with status: <strong>{statusFilter}</strong></p>
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className="btn btn-secondary"
                  >
                    Show All Orders
                  </button>
                </div>
              ) : (
                <div className="orders-grid">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Order #{order._id.slice(-8)}</h4>
                          <span className={getStatusBadgeClass(order.status)}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="order-summary">
                        <div className="order-items">
                          <p><strong>{order.items.length}</strong> item(s)</p>
                          <div className="item-names">
                            {order.items.slice(0, 2).map((item, index) => (
                              <span key={index} className="item-name">
                                {item.product?.name || 'Product'}
                                {index < Math.min(order.items.length - 1, 1) && ', '}
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <span className="more-items">
                                +{order.items.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="order-total">
                          <span className="total-amount">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="order-actions">
                        <button 
                          onClick={() => fetchOrderDetails(order._id)}
                          className="btn btn-primary btn-small"
                        >
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="btn btn-secondary btn-small">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📦 Order Details</h2>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="order-detail-header">
                  <div className="detail-section">
                    <h4>Order Information</h4>
                    <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                    <p><strong>Status:</strong> 
                      <span className={getStatusBadgeClass(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                      </span>
                    </p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Shipping Address</h4>
                    <div className="address">
                      <p>{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && (
                        <p>📞 {selectedOrder.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Order Items</h4>
                  <div className="order-items-detail">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-detail">
                        <div className="item-info">
                          <p className="item-name">{item.product?.name || 'Product'}</p>
                          <p className="item-price">${item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-tracking">
                  <h4>📍 Order Tracking</h4>
                  <div className="tracking-steps">
                    <div className={`tracking-step ${['pending', 'confirmed', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                      <div className="step-icon">📝</div>
                      <div className="step-info">
                        <p>Order Placed</p>
                        <small>Order confirmed and processing</small>
                      </div>
                    </div>
                    
                    <div className={`tracking-step ${['confirmed', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                      <div className="step-icon">✅</div>
                      <div className="step-info">
                        <p>Order Confirmed</p>
                        <small>Payment verified, preparing for shipment</small>
                      </div>
                    </div>
                    
                    <div className={`tracking-step ${['shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                      <div className="step-icon">🚚</div>
                      <div className="step-info">
                        <p>Shipped</p>
                        <small>Package is on the way</small>
                      </div>
                    </div>
                    
                    <div className={`tracking-step ${selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                      <div className="step-icon">📦</div>
                      <div className="step-info">
                        <p>Delivered</p>
                        <small>Package delivered successfully</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 