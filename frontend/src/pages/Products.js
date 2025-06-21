import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/products?${params.toString()}`);
      let fetchedProducts = response.data.data;

      // Client-side sorting
      if (filters.sortBy) {
        fetchedProducts = sortProducts(fetchedProducts, filters.sortBy);
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortBy) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="container">
      <div className="products-page">
        <div className="page-header">
          <h1>🛍️ Our Products</h1>
          <p>Discover amazing products at great prices</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>🔍 Filter & Search</h2>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-secondary btn-small">
                Clear Filters
              </button>
            )}
          </div>

          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label>Search Products</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-control"
              />
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>

            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="form-control"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <h2>📦 Products</h2>
            <div className="results-count">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{products.length} product{products.length !== 1 ? 's' : ''} found</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search filters or browse all categories.</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Show All Products
              </button>
            </div>
          ) : (
            <div className="products-grid grid grid-3">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Category Quick Links */}
        {!hasActiveFilters && categories.length > 0 && (
          <div className="categories-section">
            <h2>🏷️ Shop by Category</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category)}
                  className="category-card"
                >
                  <span className="category-name">{category}</span>
                  <span className="category-count">
                    {products.filter(p => p.category === category).length} items
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 