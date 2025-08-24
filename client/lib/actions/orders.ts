"use server";

import { getCurrentUser, getAuthToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  name?: string;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  transactionId?: string;
  totalAmount: number;
  shipping: number;
  tax: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: any;
  error?: string;
}

export async function createOrder(
  orderData: CreateOrderData
): Promise<OrderResponse> {
  try {
    console.log("🔐 Starting order creation...");

    // Get authenticated user and token
    const user = await getCurrentUser();
    const token = await getAuthToken();

    console.log(
      "👤 Auth check - User:",
      user ? `${user.firstName} ${user.lastName}` : "None"
    );
    console.log("🎫 Auth check - Token:", token ? "Present" : "Missing");

    if (!user || !token) {
      console.log("❌ Authentication failed");
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    // Prepare order payload for backend
    const orderPayload = {
      items: orderData.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: {
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        street: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        zipCode: orderData.shippingAddress.zipCode,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email,
      },
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      transactionId: orderData.transactionId,
      totalAmount: orderData.totalAmount,
      shipping: orderData.shipping,
      tax: orderData.tax,
    };

    console.log("📦 Order payload:", JSON.stringify(orderPayload, null, 2));

    // Call backend API
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    console.log("📡 API Response status:", response.status);

    const data = await response.json();
    console.log("📥 API Response data:", data);

    if (!response.ok) {
      console.log("❌ API Error:", data);
      return {
        success: false,
        message: data.error || "Failed to create order",
        error: data.error || data.details || "Unknown error",
      };
    }

    console.log("✅ Order created successfully");
    return {
      success: true,
      message: data.message || "Order placed successfully",
      order: data.order,
    };
  } catch (error) {
    console.error("💥 Create order error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function getUserOrders(page: number = 1, limit: number = 10) {
  try {
    // Get authenticated user and token
    const user = await getCurrentUser();
    const token = await getAuthToken();

    if (!user || !token) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view orders",
      };
    }

    const response = await fetch(
      `${API_BASE}/api/orders/my-orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to fetch orders",
        error: data.error,
      };
    }

    return {
      success: true,
      orders: data.orders,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Get orders error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "Network error",
    };
  }
}

export async function getOrderById(orderId: string) {
  try {
    // Get authenticated user and token
    const user = await getCurrentUser();
    const token = await getAuthToken();

    if (!user || !token) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view order details",
      };
    }

    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to fetch order",
        error: data.error,
      };
    }

    return {
      success: true,
      order: data.order,
    };
  } catch (error) {
    console.error("Get order error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "Network error",
    };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    // Get authenticated user and token
    const user = await getCurrentUser();
    const token = await getAuthToken();

    if (!user || !token) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to cancel order",
      };
    }

    const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to cancel order",
        error: data.error,
      };
    }

    return {
      success: true,
      message: data.message || "Order cancelled successfully",
      order: data.order,
    };
  } catch (error) {
    console.error("Cancel order error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "Network error",
    };
  }
}
