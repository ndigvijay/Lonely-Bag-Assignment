import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartItemsCount, getCartTotal } = useCart();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersResponse = await axios.get('/api/orders');
      const orders = ordersResponse.data.data;

      // Calculate statistics
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;

      setStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        completedOrders
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="container"><div className="loading">Loading dashboard...</div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's an overview of your account and recent activity</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* User Profile Card */}
        <div className="dashboard-section">
          <h2>👤 Profile Information</h2>
          <div className="card profile-card">
            <div className="profile-info">
              <div className="profile-details">
                <div className="profile-item">
                  <label>Name:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="profile-item">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="profile-item">
                  <label>Phone:</label>
                  <span>{user?.phone || 'Not provided'}</span>
                </div>
                <div className="profile-item">
                  <label>Member Since:</label>
                  <span>{new Date(user?.createdAt).toLocaleDateString() || 'N/A'}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary btn-small">Edit Profile</button>
                <button className="btn btn-secondary btn-small">Change Password</button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="dashboard-section">
          <h2>📊 Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>${stats.totalSpent.toFixed(2)}</h3>
                <p>Total Spent</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.completedOrders}</h3>
                <p>Completed Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Cart Status */}
        <div className="dashboard-section">
          <h2>🛒 Current Cart</h2>
          <div className="card cart-status">
            <div className="cart-info">
              <div className="cart-details">
                <p><strong>Items in Cart:</strong> {getCartItemsCount()}</p>
                <p><strong>Cart Total:</strong> ${getCartTotal().toFixed(2)}</p>
              </div>
              <div className="cart-actions">
                <Link to="/cart" className="btn btn-primary">View Cart</Link>
                {getCartItemsCount() > 0 && (
                  <Link to="/checkout" className="btn btn-success">Checkout</Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>⚡ Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/products" className="action-card">
              <div className="action-icon">🛍️</div>
              <h3>Browse Products</h3>
              <p>Discover new items</p>
            </Link>
            <Link to="/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Orders</h3>
              <p>Track your purchases</p>
            </Link>
            <Link to="/cart" className="action-card">
              <div className="action-icon">🛒</div>
              <h3>Shopping Cart</h3>
              <p>Review items</p>
            </Link>
            <button className="action-card" onClick={fetchDashboardData}>
              <div className="action-icon">🔄</div>
              <h3>Refresh Data</h3>
              <p>Update dashboard</p>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>📦 Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All Orders →</Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <p>🛒 No orders yet!</p>
                <p>Start shopping to see your orders here.</p>
                <Link to="/products" className="btn btn-primary">Start Shopping</Link>
              </div>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <strong>Order #{order._id.slice(-6)}</strong>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="order-details">
                    <div className="order-items">
                      <p>{order.items.length} item(s)</p>
                      <div className="order-products">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="product-name">
                            {item.product?.name || 'Product'}
                            {index < order.items.length - 1 && ', '}
                          </span>
                        ))}
                        {order.items.length > 3 && '...'}
                      </div>
                    </div>
                    <div className="order-total">
                      <strong>${order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="order-actions">
                    <Link to={`/orders`} className="btn btn-primary btn-small">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 