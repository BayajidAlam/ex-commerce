const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: Array<{ url: string; alt: string }>;
  sizes: Array<{ size: string; stock: number }>;
  colors: string[];
  sku: string;
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  inStock: boolean;
  isActive: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  originalPrice?: number;
  discount?: any;
  dimensions?: any;
  discountedPrice?: number;
  rating?: {
    average: number;
    count: number;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}

// Get products with filters (server-side)
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  try {
    // Set default limit to 6 if not provided
    const defaultFilters = {
      limit: 6,
      ...filters,
    };

    const queryParams = new URLSearchParams();

    Object.entries(defaultFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE}/api/products?${queryParams.toString()}`;
    console.log("🔍 Fetching products from:", url);

    const response = await fetch(url, {
      cache: "no-store", // Always get fresh data for server-side
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Products response:", data);

    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    // Return empty result on error
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    };
  }
}

// Get single product by ID (server-side)
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
}

// Get categories (server-side)
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      cache: "force-cache", // Categories don't change often
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
}

// Transform backend product to frontend format - FIXED VERSION
export function transformProduct(product: Product) {
  // Extract image URLs safely
  const imageUrls =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url).filter((url) => url) // Remove any undefined URLs
      : [];

  // Get main image (first valid image or placeholder)
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg";

  // Ensure we have at least one image for the gallery
  const galleryImages = imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"];

  return {
    id: product._id,
    name: product.name,
    price: `৳${product.price.toLocaleString()}`,
    category: product.category,
    image: mainImage, // Single main image
    images: galleryImages, // Array of image URLs for gallery
    colors: product.colors || [],
    sizes: product.sizes || [],
    description: product.description,
    inStock: product.inStock,
    seller: product.seller,
    material: "Premium Quality",
    // Add additional fields that might be useful
    originalPrice: product.originalPrice || null,
    discount: product.discount || null,
    dimensions: product.dimensions || null,
    sku: product.sku,
    featured: product.featured || false,
  };
}

// Get most sold products (server-side)
export async function getMostSoldProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/products/most-sold?limit=${limit}`,
      {
        cache: "no-store", // Always fetch fresh data for most sold products
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("❌ Error fetching most sold products:", error);
    return [];
  }
}

// Get most sold products (client-side)
export async function getMostSoldProductsClient(
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/products/most-sold?limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("❌ Error fetching most sold products:", error);
    return [];
  }
}
