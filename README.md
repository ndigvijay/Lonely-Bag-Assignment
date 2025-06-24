# Lonely Bag - MERN Ecommerce Application

A simple ecommerce application built with MERN stack (MongoDB, Express.js, React.js, Node.js) using functional programming approach.

## Project Structure
```
Lonely_Bag/
├── backend/           # Node.js Express API
├── frontend/          # React.js Client
├── docker-compose.yml # Docker orchestration
└── README.md         # This file
```

## Features
- Product catalog browsing
- Shopping cart functionality
- User authentication for checkout and payments
- Simple dashboard
- Responsive design

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, CSS3
- **Database**: MongoDB 
- **Containerization**: Docker & Docker Compose

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/ndigvijay/Lonely-Bag-Assignment.git 
cd Lonely_Bag
```

### 2. Setup MongoDB
Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017/shopify`

### 3. Run with Docker Compose
```bash
docker-compose up --build
```

### 4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development Setup

### Local Development (without Docker)

#### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env file with your settings
npm run seed    # Add dummy data
npm run dev     # Start development server
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start       # Start development server
```

### Docker Development (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- MongoDB running locally (for seeding data initially)

#### Setup Steps
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Lonely_Bag
   ```

2. **Setup environment variables**
   ```bash
   cd backend
   cp env.example .env
   cd ..
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Seed the database** (in a new terminal)
   ```bash
   cd backend
   npm install
   npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/cart` - Add to cart
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/orders` - Create order (Auth required)

## Docker Commands
```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Testing the Application

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/products/categories
```

### 2. Test Frontend
- Visit http://localhost:3000
- Navigate through Home, Products, Login pages
- Register a new account
- Test login functionality

### 3. Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

## Current Features ✅
- ✅ MERN Stack Setup
- ✅ User Authentication (Register/Login)
- ✅ Product Catalog
- ✅ Shopping Cart (localStorage)
- ✅ Basic Dashboard
- ✅ Responsive Design
- ✅ Docker Configuration
- ✅ MongoDB Integration
- ✅ API Documentation


## Environment Variables
Check `env.example` file in backend folder for required environment variables.

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   (React)       │────│   (Node.js)     │────│   (Database)    │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

