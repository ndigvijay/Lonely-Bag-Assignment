import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Lonely Bag</h3>
            <p>Your one-stop destination for quality products at affordable prices.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/cart">Cart</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/returns">Returns</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: support@lonelybag.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Lonely Bag. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 