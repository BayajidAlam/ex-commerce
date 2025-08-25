const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Category {
  id: string;
  name: string;
  count: number;
}

// Get categories (client-side)
export async function getCategoriesClient(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
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
    // Return fallback categories if API fails
    return [
      { id: "watch", name: "Watches", count: 0 },
      { id: "glass", name: "Glasses", count: 0 },
      { id: "jewelry", name: "Jewelry", count: 0 },
      { id: "bag", name: "Bags", count: 0 },
    ];
  }
}

// Get categories (server-side)
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      cache: "force-cache",
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
    // Return fallback categories if API fails
    return [
      { id: "watch", name: "Watches", count: 0 },
      { id: "glass", name: "Glasses", count: 0 },
      { id: "jewelry", name: "Jewelry", count: 0 },
      { id: "bag", name: "Bags", count: 0 },
    ];
  }
}
