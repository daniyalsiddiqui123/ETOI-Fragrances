export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateOrderNumber(): string {
  const prefix = 'ETOI'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export const DELIVERY_CHARGE = 300
export const FREE_DELIVERY_THRESHOLD = 5000

export function calculateDelivery(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateDelivery(subtotal)
}

export const WHATSAPP_NUMBER = '923282147535'

export const BANK_DETAILS = {
  accountTitle: 'Daniyal Siddiqui',
  bankName: 'United Bank Limited (UBL)',
  iban: 'PK95UNIL0109000373825051',
  accountNumber: '2653373825051',
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
