'use client'

import type { CartItem } from '@/lib/types'
import { formatPrice, calculateDelivery, calculateTotal, DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '@/lib/utils'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
}

export function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const delivery = calculateDelivery(subtotal)
  const total = calculateTotal(subtotal)

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-etoi-primary border-b border-gray-200 pb-3">
        Order Summary
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src={item.productImage || '/images/product-placeholder.svg'}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-etoi-primary truncate">
                {item.productName}
              </p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm text-etoi-primary font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Delivery</span>
          <span className={delivery === 0 ? 'text-green-600' : 'text-gray-500'}>
            {delivery === 0 ? 'Free' : formatPrice(delivery)}
          </span>
        </div>
        {subtotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-[11px] text-gray-400 -mt-1">
            Free delivery on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)}
          </p>
        )}
        <div className="flex justify-between text-base text-etoi-primary font-medium border-t border-gray-200 pt-2 mt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
