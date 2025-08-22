const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Types
export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  images: Array<{ url: string; alt: string }>
  sizes: Array<{ size: string; stock: number }>
  colors: string[]
  sku: string
  seller: {
    _id: string
    firstName: string
    lastName: string
  }
  inStock: boolean
  isActive: boolean
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

// Get products with filters (server-side)
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const url = `${API_BASE}/api/products?${queryParams.toString()}`
    console.log('🔍 Fetching products from:', url)

    const response = await fetch(url, {
      cache: 'no-store', // Always get fresh data for server-side
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📦 Products response:', data)

    return data
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    // Return empty result on error
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 6,
        total: 0,
        pages: 0
      }
    }
  }
}

// Get single product by ID (server-side)
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return null
  }
}

// Get categories (server-side)
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      cache: 'force-cache', // Categories don't change often
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return []
  }
}

// Transform backend product to frontend format
export function transformProduct(product: Product) {
  return {
    id: product._id,
    name: product.name,
    price: `৳${product.price.toLocaleString()}`,
    originalPrice: product.price > 0 ? `৳${(product.price * 1.2).toLocaleString()}` : undefined,
    category: product.category,
    image: product.images?.[0]?.url || '/placeholder.svg',
    images: product.images?.map(img => img.url) || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    description: product.description,
    inStock: product.inStock,
    seller: product.seller
  }
}