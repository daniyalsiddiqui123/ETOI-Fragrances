'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface CartNotificationProps {
  show: boolean
  productName: string
  productImage: string
  onClose: () => void
  duration?: number
}

export function CartNotification({
  show,
  productName,
  productImage,
  onClose,
  duration = 3000,
}: CartNotificationProps) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [show, onClose, duration])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 sm:bottom-8 sm:right-6 sm:left-auto z-[100] w-full sm:w-full sm:max-w-sm"
        >
          <div className="bg-white border-t sm:border border-gray-100 shadow-2xl p-4 sm:p-4">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-3 sm:right-3 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-[14px] sm:h-[14px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" className="sm:w-[16px] sm:h-[16px]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm sm:text-sm text-etoi-primary font-medium">Added to Cart</span>
            </div>

            <div className="flex items-center gap-3 pb-3 sm:pb-3 border-b border-gray-50">
              <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gray-50 overflow-hidden shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm sm:text-sm text-gray-600 truncate font-medium">{productName}</p>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full text-center text-xs sm:text-xs tracking-[0.15em] uppercase text-etoi-primary font-semibold py-3 sm:py-3 mt-2 sm:mt-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              View Cart
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
