import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Lonely Bag</h1>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              Cart ({getCartItemsCount()})
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name}</span>
                <Link to="/orders" className="nav-link">Orders</Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-small">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-primary btn-small">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary btn-small">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 