import type { Product } from './types'

export const sampleProducts: Product[] = [
  {
    id: 'men-1',
    sanityId: 'men-1',
    name: 'Oud Royale',
    description: 'A captivating blend of rare Cambodian oud, saffron, and amber. This intense woody fragrance opens with spicy saffron notes, settles into a heart of smoked leather, and lingers with a base of precious oud and musk. Perfect for evening occasions.',
    price: 12500,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'men-2',
    sanityId: 'men-2',
    name: 'Silver Cedar',
    description: 'A sophisticated fusion of Virginia cedar, bergamot, and white musk. Fresh yet grounded, this fragrance captures the essence of a misty forest morning with bright citrus top notes and a warm, woody finish.',
    price: 8900,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'men-3',
    sanityId: 'men-3',
    name: 'Midnight Vetiver',
    description: 'Dark, earthy vetiver accented with black pepper, leather, and smoky tobacco. A bold statement fragrance for the modern gentleman who commands attention without saying a word.',
    price: 11000,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'men-4',
    sanityId: 'men-4',
    name: 'Coastal Breeze',
    description: 'An aquatic marine fragrance with Italian bergamot, sea salt accord, and driftwood. Crisp, clean, and refreshing — like a walk along the Mediterranean coast at sunrise.',
    price: 7500,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    createdAt: new Date('2024-04-05').toISOString(),
  },
  {
    id: 'men-5',
    sanityId: 'men-5',
    name: 'Saffron Noir',
    description: 'A luxurious oriental composition featuring Persian saffron, black rose, and patchouli. Spicy, floral, and deeply alluring — a fragrance that reveals new layers throughout the day.',
    price: 14500,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    createdAt: new Date('2024-05-18').toISOString(),
  },
  {
    id: 'men-6',
    sanityId: 'men-6',
    name: 'Tobacco Vanille',
    description: 'Rich tobacco leaves blended with creamy vanilla, dried fruits, and a hint of cognac. Warm, intoxicating, and undeniably luxurious — the definitive cold-weather companion.',
    price: 13500,
    category: 'men',
    images: ['/images/product-placeholder.svg'],
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
    createdAt: new Date('2024-06-22').toISOString(),
  },
  {
    id: 'women-1',
    sanityId: 'women-1',
    name: 'Bloom No. 5',
    description: 'A delicate dance of tuberose, jasmine, and ylang-ylang on a bed of sandalwood and vanilla. This timeless floral fragrance embodies grace, elegance, and quiet confidence.',
    price: 9500,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.9,
    reviewCount: 245,
    inStock: true,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'women-2',
    sanityId: 'women-2',
    name: 'Amber Rose',
    description: 'Damask rose petals floating in a sea of golden amber and warm cashmeran. Romantic, opulent, and unforgettable — a fragrance that leaves a trail of elegance.',
    price: 10500,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.7,
    reviewCount: 178,
    inStock: true,
    createdAt: new Date('2024-02-14').toISOString(),
  },
  {
    id: 'women-3',
    sanityId: 'women-3',
    name: 'White Iris',
    description: 'Delicate iris butter softened by pear nectar, white musk, and a whisper of violet. Ethereal, powdery, and impossibly elegant — for the woman who embodies understated luxury.',
    price: 11800,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.6,
    reviewCount: 134,
    inStock: true,
    createdAt: new Date('2024-03-25').toISOString(),
  },
  {
    id: 'women-4',
    sanityId: 'women-4',
    name: 'Musk Eternel',
    description: 'Clean white musk layered with peony, lily of the valley, and soft ambrette seed. Pure, sensual, and effortlessly sophisticated — a signature scent for the modern woman.',
    price: 8200,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    createdAt: new Date('2024-04-30').toISOString(),
  },
  {
    id: 'women-5',
    sanityId: 'women-5',
    name: 'Sakura Rain',
    description: 'Cherry blossom, fresh rain accord, and green tea with a soft base of rice powder and cedar. A serene, poetic fragrance inspired by Japanese spring gardens.',
    price: 7800,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    createdAt: new Date('2024-05-12').toISOString(),
  },
  {
    id: 'women-6',
    sanityId: 'women-6',
    name: 'Noir Velvet',
    description: 'Blackcurrant, dark chocolate, and rose absolute meet patchouli and vanilla absolute. Deep, sensual, and seductive — for evenings when you want to leave a lasting impression.',
    price: 13800,
    category: 'women',
    images: ['/images/product-placeholder.svg'],
    rating: 4.7,
    reviewCount: 211,
    inStock: true,
    createdAt: new Date('2024-06-08').toISOString(),
  },
]

export function getProductById(id: string): Product | undefined {
  return sampleProducts.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((p) => p.id === slug)
}

export function getProductsByCategory(category: 'men' | 'women'): Product[] {
  return sampleProducts.filter((p) => p.category === category)
}

export function getBestSellers(limit = 4): Product[] {
  return [...sampleProducts].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function getRelatedProducts(productId: string, category: string, limit = 4): Product[] {
  return sampleProducts
    .filter((p) => p.category === category && p.id !== productId)
    .slice(0, limit)
}
