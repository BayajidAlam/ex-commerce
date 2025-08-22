// lib/api.js - Simple API calls for your backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Transform backend data to match your existing frontend structure
function transformProduct(product) {
  return {
    id: product._id,
    name: product.name,
    price: `৳${product.price.toLocaleString()}`,
    category: product.category,
    image: product.images?.[0]?.url || "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    originalPrice: product.originalPrice ? `৳${product.originalPrice.toLocaleString()}` : null,
    inStock: product.isActive,
    description: product.description,
    colors: product.colors || [],
    sizes: product.sizes || [],
    material: product.material,
    dimensions: product.dimensions,
    images: product.images?.map(img => img.url) || ["https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg"],
    featured: product.featured,
    tags: product.tags || [],
    rating: product.rating,
    seller: product.seller,
    sku: product.sku,
  };
}

// Get all products (for products page)
export async function getProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    
    return {
      products: data.products?.map(transformProduct) || [],
      pagination: data.pagination || { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 20 }
    };
  } catch (error) {
    console.error('API Error:', error);
    return { products: [], pagination: { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 20 } };
  }
}

// Get featured products (for homepage)
export async function getFeaturedProducts() {
  try {
    const response = await fetch(`${API_BASE}/products/featured/list`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }

    const data = await response.json();
    return data.products?.map(transformProduct) || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

// Get single product (for product detail page)
export async function getProduct(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return transformProduct(data.product);
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Client-side API for authentication and orders
export class ClientAPI {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API Error');
    }

    return data;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const clientAPI = new ClientAPI();