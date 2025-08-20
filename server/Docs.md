# Aluna E-commerce Backend - Complete Documentation

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env file
Create a `.env` file in your project root with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aluna-ecommerce
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB
Start MongoDB locally or use MongoDB Atlas

### 4. Seed the Database
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Server Access
Server runs on `http://localhost:5000`

---

## 💰 Budget-Friendly Deployment

| Service | Provider | Cost | Storage/Features |
|---------|----------|------|------------------|
| Database | MongoDB Atlas (Free Tier) | $0 | 512MB storage |
| Hosting | Railway/Render (Free Tier) | $0 | Basic hosting |

---

## 📋 Complete API Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### 🛍️ Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Get all products (with filtering) | ❌ |
| `GET` | `/api/products/:id` | Get single product | ❌ |
| `POST` | `/api/products` | Create product | ✅ (Seller only) |
| `PUT` | `/api/products/:id` | Update product | ✅ (Seller only) |
| `DELETE` | `/api/products/:id` | Delete product | ✅ (Seller only) |
| `GET` | `/api/products/featured/list` | Get featured products | ❌ |

**Query Parameters for GET /api/products:**
- `page` - Page number
- `limit` - Items per page
- `category` - Filter by category
- `search` - Search in name/description
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (name, price, createdAt, rating)
- `sortOrder` - Sort direction (asc, desc)

### 📦 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders` | Create new order | ✅ |
| `GET` | `/api/orders/my-orders` | Get user's orders | ✅ |
| `GET` | `/api/orders/:id` | Get single order | ✅ |

### 👤 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `PUT` | `/api/users/profile` | Update user profile | ✅ |
| `POST` | `/api/users/wishlist/:productId` | Add to wishlist | ✅ |
| `DELETE` | `/api/users/wishlist/:productId` | Remove from wishlist | ✅ |
| `GET` | `/api/users/wishlist` | Get user's wishlist | ✅ |

### 📂 Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/categories` | Get all categories with counts | ❌ |

---

## 📝 Request/Response Examples

### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+8801712345678",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login User

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Create Product (Seller)

**Request:**
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer jwt-token

{
  "name": "Summer Cotton Shirt",
  "description": "Lightweight cotton shirt perfect for summer",
  "price": 1500,
  "category": "casual",
  "sku": "ALN-SCS-001",
  "sizes": [
    {"size": "M", "stock": 10},
    {"size": "L", "stock": 5}
  ],
  "colors": ["White", "Blue"],
  "images": [
    {"url": "image-url", "alt": "Summer Cotton Shirt"}
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "product-id",
    "name": "Summer Cotton Shirt",
    "description": "Lightweight cotton shirt perfect for summer",
    "price": 1500,
    "category": "casual",
    "sku": "ALN-SCS-001",
    "seller": {
      "id": "seller-id",
      "firstName": "Seller",
      "lastName": "Name"
    }
  }
}
```

### Create Order

**Request:**
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer jwt-token

{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "size": "M",
      "color": "Blue"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka",
    "zipCode": "1000",
    "country": "Bangladesh",
    "phone": "+8801712345678"
  },
  "paymentMethod": "cod"
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "id": "order-id",
    "orderNumber": "ALN1640995200123",
    "totalAmount": 3000,
    "status": "pending",
    "items": [
      {
        "product": {
          "name": "Summer Cotton Shirt",
          "price": 1500
        },
        "quantity": 2,
        "price": 1500
      }
    ]
  }
}
```

---

## 🔧 Frontend Integration

### Example API calls for your Next.js frontend

#### Login Function
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};
```

#### Get Products Function
```javascript
const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);
  return await response.json();
};
```

#### Create Order Function
```javascript
const createOrder = async (orderData, token) => {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return await response.json();
};
```

#### Update Zustand Store Integration
```javascript
// Update your existing auth store
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const result = await login(email, password);
    if (result.token) {
      set({ 
        user: result.user, 
        token: result.token, 
        isAuthenticated: true 
      });
      localStorage.setItem('token', result.token);
    }
    return result;
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('token');
  }
}));
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Input Validation** - express-validator on all endpoints
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **CORS Protection** - Configured for frontend URL
- ✅ **Security Headers** - Helmet middleware
- ✅ **Role-based Access** - User/Seller permissions

---

## 📈 Scalability Features

- ✅ **MongoDB Indexes** - Optimized queries for better performance
- ✅ **Pagination** - Handle large datasets efficiently
- ✅ **Soft Delete** - Products marked inactive instead of deleted
- ✅ **Aggregation Queries** - Efficient category counting
- ✅ **Modular Structure** - Organized routes and middleware
- ✅ **Error Handling** - Centralized error management
- ✅ **Connection Pooling** - MongoDB connection optimization

---

## 🧪 Test Credentials

After running `npm run seed`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Seller 1 | `seller@aluna.com` | `seller123` |
| Seller 2 | `fashion@aluna.com` | `seller123` |
| User | `user@example.com` | `user123` |

---

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: ['user', 'seller'],
  isActive: Boolean,
  address: Object,
  wishlist: [ProductId],
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ['casual', 'formal', 'traditional', 'bag', 'jewellry', 'glass', 'watch'],
  images: [{ url, alt }],
  sizes: [{ size, stock }],
  colors: [String],
  sku: String (unique),
  seller: UserId,
  isActive: Boolean,
  featured: Boolean,
  tags: [String],
  rating: { average, count },
  timestamps: true
}
```

### Order Model
```javascript
{
  user: UserId,
  items: [{ product, quantity, price, size, color }],
  totalAmount: Number,
  shippingAddress: Object,
  status: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  paymentStatus: ['pending', 'paid', 'failed', 'refunded'],
  paymentMethod: ['cod', 'card', 'mobile_banking'],
  orderNumber: String (unique),
  timestamps: true
}
```

---

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aluna-ecommerce
JWT_SECRET=super-secure-random-string-for-production
FRONTEND_URL=https://your-frontend-domain.com
```

---

This backend is **production-ready** and can efficiently handle your Aluna e-commerce requirements with room for growth! 🎉