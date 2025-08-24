// Admin API actions for products and orders management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to get auth headers
function getAuthHeaders() {
  let token = null;

  // First try to get token from client-accessible cookie
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    console.log("All cookies:", cookies);

    const tokenCookie = cookies.find((row) =>
      row.startsWith("auth-token-client=")
    );
    if (tokenCookie) {
      token = tokenCookie.split("=")[1];
      console.log("Token found in auth-token-client cookie");
    } else {
      // Fallback to check if token is in regular auth-token cookie (if it's not httpOnly)
      const fallbackCookie = cookies.find((row) =>
        row.startsWith("auth-token=")
      );
      if (fallbackCookie) {
        token = fallbackCookie.split("=")[1];
        console.log("Token found in auth-token cookie");
      }
    }
  }

  // Fallback to localStorage if cookies are not available
  if (!token && typeof localStorage !== "undefined") {
    token = localStorage.getItem("auth-token");
    if (token) {
      console.log("Token found in localStorage");
    }
  }

  console.log("Final token status:", token ? "Found" : "Not found");
  if (token) {
    console.log("Token preview:", token.substring(0, 20) + "...");
  }

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

// Debug function to check cookie status
function debugCookieAuth() {
  console.log("=== COOKIE DEBUG ===");
  console.log("All cookies:", document.cookie);
  console.log(
    "Auth token client:",
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token-client="))
  );
  console.log(
    "Auth token:",
    document.cookie.split("; ").find((row) => row.startsWith("auth-token="))
  );
  console.log("LocalStorage auth token:", localStorage.getItem("auth-token"));
  console.log("==================");
}

// Product Management APIs
export const adminGetProducts = async () => {
  try {
    console.log("🔍 Fetching admin products...");
    debugCookieAuth(); // Add debug call
    const headers = getAuthHeaders();
    console.log("📨 Request headers:", headers);

    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      headers,
    });

    console.log("📡 Response status:", response.status);
    const data = await response.json();
    console.log("📦 Response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return { success: false, message: "Failed to fetch products" };
  }
};

export const adminCreateProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "Failed to create product" };
  }
};

export const adminUpdateProduct = async (productId, productData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Failed to update product" };
  }
};

export const adminDeleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product" };
  }
};

export const adminGetProduct = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, message: "Failed to fetch product" };
  }
};

export const adminToggleProductFeatured = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}/toggle-featured`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return { success: false, message: "Failed to toggle featured status" };
  }
};

export const adminToggleProductActive = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}/toggle-active`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling active status:", error);
    return { success: false, message: "Failed to toggle active status" };
  }
};

// Order Management APIs
export const adminGetOrders = async (
  page = 1,
  limit = 50,
  status = "all",
  search = ""
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status !== "all" && { status }),
      ...(search && { search }),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/orders?${params}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
};

export const adminGetOrder = async (orderId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/${orderId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, message: "Failed to fetch order" };
  }
};

export const adminUpdateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status" };
  }
};

export const adminUpdateOrder = async (orderId, orderData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/${orderId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, message: "Failed to update order" };
  }
};

export const adminDeleteOrder = async (orderId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/${orderId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, message: "Failed to delete order" };
  }
};

// Admin Dashboard Stats
export const adminGetStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/stats`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { success: false, message: "Failed to fetch dashboard stats" };
  }
};

// Cloudinary upload helper
export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "arjo_products"
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      message: "Failed to upload image",
    };
  }
};

// Batch upload to Cloudinary
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);

    const successful = results.filter((result) => result.success);
    const failed = results.filter((result) => !result.success);

    return {
      success: failed.length === 0,
      successful,
      failed,
      message: `${successful.length} images uploaded successfully${
        failed.length > 0 ? `, ${failed.length} failed` : ""
      }`,
    };
  } catch (error) {
    console.error("Batch upload error:", error);
    return {
      success: false,
      message: "Failed to upload images",
    };
  }
};

// Test authentication endpoint
export const testAdminAuth = async () => {
  try {
    debugCookieAuth(); // Add debug call
    const headers = getAuthHeaders();
    console.log("🧪 Testing admin auth with headers:", headers);

    const response = await fetch(`${API_BASE_URL}/api/auth/debug-token`, {
      headers,
    });

    const data = await response.json();
    console.log("🧪 Admin auth test result:", data);
    return data;
  } catch (error) {
    console.error("🚨 Admin auth test error:", error);
    return { success: false, message: "Auth test failed" };
  }
};
