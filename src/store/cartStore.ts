'use client'

import { create } from 'zustand'
import type { CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('etoi-cart')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('etoi-cart', JSON.stringify(items))
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadCartFromStorage(),

  addItem: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId)
      let newItems: CartItem[]
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      } else {
        newItems = [...state.items, item]
      }
      saveCartToStorage(newItems)
      return { items: newItems }
    })
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.productId !== productId)
      saveCartToStorage(newItems)
      return { items: newItems }
    })
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity < 1) return
    set((state) => {
      const newItems = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      saveCartToStorage(newItems)
      return { items: newItems }
    })
  },

  clearCart: () => {
    saveCartToStorage([])
    set({ items: [] })
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))
