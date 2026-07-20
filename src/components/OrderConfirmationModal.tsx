'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { CartItem } from '@/lib/types'
import { formatPrice, getWhatsAppLink, BANK_DETAILS } from '@/lib/utils'

interface OrderConfirmationModalProps {
  show: boolean
  orderNumber: string
  items: CartItem[]
  address: string
  city: string
  total: number
  paymentMethod: string
  onClose: () => void
}

function itemsSummary(items: CartItem[]): string {
  return items.map((i) => `${i.productName} x${i.quantity}`).join(', ')
}

export function OrderConfirmationModal({
  show,
  orderNumber,
  items,
  address,
  city,
  total,
  paymentMethod,
  onClose,
}: OrderConfirmationModalProps) {
  const isBankTransfer = paymentMethod === 'bank_transfer'

  const waMessage = isBankTransfer
    ? `Hi ÉTOI! I've placed an order via Bank Transfer.\n\nOrder: ${orderNumber}\nAmount: PKR ${total.toLocaleString()}\nItems: ${itemsSummary(items)}\nAddress: ${address}, ${city}\n\nI'll send the payment screenshot shortly.`
    : ''

  const handleWhatsApp = () => {
    window.open(getWhatsAppLink(waMessage), '_blank')
  }

  const handleClose = () => {
    if (isBankTransfer) {
      handleWhatsApp()
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 text-center border-b border-gray-100">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" className="sm:w-[28px] sm:h-[28px]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h2 className="font-serif text-xl sm:text-2xl text-etoi-primary mb-1">Order Confirmed!</h2>
              <p className="text-xs sm:text-sm text-gray-400">Thank you for your purchase</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="bg-etoi-cream/50 p-3 sm:p-4 text-center">
                <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-400 mb-1">Order Number</p>
                <p className="font-mono text-xs sm:text-sm text-etoi-primary font-medium break-all">{orderNumber}</p>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm">
                      <span className="text-etoi-primary truncate pr-2">
                        {item.productName}
                        <span className="text-gray-400 ml-1">x{item.quantity}</span>
                      </span>
                      <span className="text-etoi-primary font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-start gap-3 text-sm text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{address}, {city}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-etoi-primary bg-green-50 p-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Estimated delivery: <strong>3-5 business days</strong></span>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Charged</span>
                <span className="text-lg font-serif text-etoi-primary font-medium">{formatPrice(total)}</span>
              </div>

              <div className="text-[11px] text-gray-400 text-center">
                Payment: {isBankTransfer ? 'Bank Transfer' : 'Cash on Delivery'}
              </div>

              {isBankTransfer && (
                <>
                  <div className="p-3 sm:p-4 border border-gray-200 bg-etoi-cream/30 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-400 mb-1.5 sm:mb-2">Bank Account Details</p>
                    <p className="flex flex-wrap gap-1"><span className="text-gray-400 shrink-0">Account Title:</span> <span className="text-etoi-primary font-medium">{BANK_DETAILS.accountTitle}</span></p>
                    <p className="flex flex-wrap gap-1"><span className="text-gray-400 shrink-0">Bank:</span> <span className="text-etoi-primary font-medium">{BANK_DETAILS.bankName}</span></p>
                    <p className="flex flex-wrap gap-1"><span className="text-gray-400 shrink-0">IBAN:</span> <span className="text-etoi-primary font-mono text-[10px] sm:text-xs break-all">{BANK_DETAILS.iban}</span></p>
                    <p className="flex flex-wrap gap-1"><span className="text-gray-400 shrink-0">Account No:</span> <span className="text-etoi-primary font-mono">{BANK_DETAILS.accountNumber}</span></p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-green-600 text-white text-xs sm:text-sm py-3.5 sm:py-4 hover:bg-green-700 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-[20px] sm:h-[20px] shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="whitespace-nowrap">Send Payment Screenshot on WhatsApp</span>
                  </button>
                </>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 space-y-2 sm:space-y-3">
              {isBankTransfer && (
                <p className="text-[11px] sm:text-xs text-gray-400 text-center leading-relaxed">
                  Please send your payment screenshot via WhatsApp to confirm your order.
                </p>
              )}
              <Link
                href="/"
                onClick={onClose}
                className="block w-full bg-etoi-primary text-white text-[11px] sm:text-xs tracking-[0.15em] uppercase py-3.5 sm:py-4 text-center hover:bg-etoi-secondary transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
