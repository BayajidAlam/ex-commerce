"use server";

import { getCurrentUser, getAuthToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to get auth headers for server-side requests
async function getServerAuthHeaders() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Admin Products Management
export async function getAdminProducts() {
  try {
    console.log("🔍 Fetching admin products (server action)...");
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();
    console.log("📨 Request headers (server):", {
      Authorization: headers.Authorization ? "Bearer ***" : "None",
    });

    const response = await fetch(`${API_BASE}/api/admin/products`, {
      headers,
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Products API error:", response.status, errorText);
      return {
        success: false,
        message: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log(
      "✅ Products fetched successfully:",
      data.products?.length || 0,
      "products"
    );
    return data;
  } catch (error) {
    console.error("💥 Error fetching admin products:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

// Admin Orders Management
export async function getAdminOrders(
  page = 1,
  limit = 50,
  status = "all",
  search = ""
) {
  try {
    console.log("🔍 Fetching admin orders (server action)...");
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status !== "all" && { status }),
      ...(search && { search }),
    });

    const response = await fetch(`${API_BASE}/api/admin/orders?${params}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Orders API error:", response.status, errorText);
      return {
        success: false,
        message: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log(
      "✅ Orders fetched successfully:",
      data.orders?.length || 0,
      "orders"
    );
    return data;
  } catch (error) {
    console.error("💥 Error fetching admin orders:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

// Admin Stats Management
export async function getAdminStats() {
  try {
    console.log("🔍 Fetching admin stats (server action)...");
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(`${API_BASE}/api/admin/orders/stats`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stats API error:", response.status, errorText);
      return {
        success: false,
        message: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("✅ Stats fetched successfully");
    return data;
  } catch (error) {
    console.error("💥 Error fetching admin stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}

// Product CRUD Operations
export async function createProduct(productData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(`${API_BASE}/api/admin/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to create product: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(productId: string, productData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(
      `${API_BASE}/api/admin/products/${productId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to update product: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(
      `${API_BASE}/api/admin/products/${productId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to delete product: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// Order Management Operations
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(
      `${API_BASE}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to update order status: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to get order details: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting order details:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get order details",
    };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Admin access required" };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to delete order: ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}

// Test admin authentication
export async function testAdminAuth() {
  try {
    console.log("🧪 Testing admin auth (server action)...");
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, message: "No user found" };
    }

    if (user.role !== "admin") {
      return {
        success: false,
        message: "User is not admin",
        user: { role: user.role },
      };
    }

    const headers = await getServerAuthHeaders();

    const response = await fetch(`${API_BASE}/api/auth/debug-token`, {
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    console.log("🧪 Admin auth test result:", data);
    return {
      success: true,
      message: "Admin auth working",
      data,
      user: { role: user.role },
    };
  } catch (error) {
    console.error("🚨 Admin auth test error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Auth test failed",
    };
  }
}
