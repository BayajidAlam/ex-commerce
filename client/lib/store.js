"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedColor, selectedSize, quantity = 1) => {
        const items = get().items
        // Create unique key based on product id, color, and size
        const itemKey = `${product.id}-${selectedColor}-${selectedSize}`
        const existingItem = items.find((item) => 
          item.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
        )

        if (existingItem) {
          set({
            items: items.map((item) => 
              item.id === product.id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ 
            items: [...items, { 
              ...product, 
              selectedColor, 
              selectedSize, 
              quantity,
              itemKey 
            }] 
          })
        }
      },
      removeItem: (itemKey) => {
        set({ items: get().items.filter((item) => item.itemKey !== itemKey) })
      },
      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey)
          return
        }
        set({
          items: get().items.map((item) => 
            item.itemKey === itemKey ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + Number.parseFloat(item.price.replace("৳", "").replace(",", "")) * item.quantity,
          0,
        ),
    }),
    {
      name: "cart-storage",
    },
  ),
)

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))