export interface Product {
  id: string
  sanityId: string
  name: string
  description: string
  price: number
  category: 'men' | 'women'
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  rating: number
  reviewerName: string
  reviewerEmail: string
  comment: string
  createdAt: string
  verified: boolean
}

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  items: CartItem[]
  subtotal: number
  delivery: number
  total: number
  paymentMethod: 'cod' | 'bank_transfer'
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export type SortOption = 'popularity' | 'newest' | 'price-low' | 'price-high'
