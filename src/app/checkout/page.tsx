'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, calculateDelivery, calculateTotal, generateOrderNumber, BANK_DETAILS } from '@/lib/utils'
import { OrderSummary } from '@/components/OrderSummary'
import { OrderConfirmationModal } from '@/components/OrderConfirmationModal'

const cities = ['Karachi', 'Lahore', 'Islamabad', 'Other']

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    customCity: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string
    items: typeof items
    address: string
    city: string
    total: number
    paymentMethod: string
  } | null>(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (items.length === 0 && !confirmedOrder) {
    router.push('/cart')
    return null
  }

  const subtotal = getSubtotal()
  const delivery = calculateDelivery(subtotal)
  const total = calculateTotal(subtotal)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.phone.trim()) errs.phone = 'Phone number is required'
    if (!formData.address.trim()) errs.address = 'Delivery address is required'
    if (!formData.city) errs.city = 'Please select a city'
    if (formData.city === 'Other' && !formData.customCity.trim()) errs.customCity = 'Please enter your city'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const orderData = {
        orderNumber: generateOrderNumber(),
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city === 'Other' ? formData.customCity : formData.city,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        delivery,
        total,
        paymentMethod: formData.paymentMethod,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      clearCart()
      setConfirmedOrder({
        orderNumber: data.order.orderNumber,
        items: [...items],
        address: formData.address,
        city: formData.city === 'Other' ? formData.customCity : formData.city,
        total: data.order.total,
        paymentMethod: formData.paymentMethod,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl text-etoi-primary font-light mb-10">
              Checkout
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 space-y-8">
                <div className="bg-white/50 border border-gray-100 p-6">
                  <h2 className="font-serif text-lg text-etoi-primary mb-6">
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`w-full bg-transparent border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                          errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="email"
                          placeholder="Email *"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full bg-transparent border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                            errors.email ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone *"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={`w-full bg-transparent border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                            errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <textarea
                        placeholder="Delivery Address *"
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className={`w-full bg-transparent border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                          errors.address ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <select
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className={`w-full bg-transparent border px-4 py-3 text-sm focus:outline-none transition-colors ${
                          errors.city ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                        } ${formData.city ? 'text-etoi-primary' : 'text-gray-400'}`}
                      >
                        <option value="" disabled>
                          Select City *
                        </option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>

                    {formData.city === 'Other' && (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter your city *"
                          value={formData.customCity}
                          onChange={(e) =>
                            setFormData({ ...formData, customCity: e.target.value })
                          }
                          className={`w-full bg-transparent border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                            errors.customCity ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                          }`}
                        />
                        {errors.customCity && (
                          <p className="text-red-500 text-xs mt-1">{errors.customCity}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/50 border border-gray-100 p-6">
                  <h2 className="font-serif text-lg text-etoi-primary mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-etoi-primary transition-colors has-checked:bg-etoi-primary/5 has-checked:border-etoi-primary">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() =>
                          setFormData({ ...formData, paymentMethod: 'cod' })
                        }
                        className="accent-etoi-secondary"
                      />
                      <div>
                        <p className="text-sm text-etoi-primary font-medium">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-400">
                          Pay when you receive your order
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-etoi-primary transition-colors has-checked:bg-etoi-primary/5 has-checked:border-etoi-primary">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={() =>
                          setFormData({ ...formData, paymentMethod: 'bank_transfer' })
                        }
                        className="accent-etoi-secondary"
                      />
                      <div>
                        <p className="text-sm text-etoi-primary font-medium">
                          Direct Bank Transfer
                        </p>
                        <p className="text-xs text-gray-400">
                          Pay via bank transfer — details below
                        </p>
                      </div>
                    </label>
                    {formData.paymentMethod === 'bank_transfer' && (
                      <div className="mt-3 p-4 border border-gray-200 bg-etoi-cream/30 space-y-2 text-sm">
                        <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Bank Account Details</p>
                        <p><span className="text-gray-400">Account Title:</span> <span className="text-etoi-primary font-medium">{BANK_DETAILS.accountTitle}</span></p>
                        <p><span className="text-gray-400">Bank:</span> <span className="text-etoi-primary font-medium">{BANK_DETAILS.bankName}</span></p>
                        <p><span className="text-gray-400">IBAN:</span> <span className="text-etoi-primary font-mono text-xs">{BANK_DETAILS.iban}</span></p>
                        <p><span className="text-gray-400">Account No:</span> <span className="text-etoi-primary font-mono">{BANK_DETAILS.accountNumber}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white/50 border border-gray-100 p-6 sticky top-28">
                  <OrderSummary items={items} subtotal={subtotal} />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-etoi-primary text-white text-xs tracking-[0.15em] uppercase py-4 mt-6 hover:bg-etoi-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {submitError && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 shadow-xl text-sm">
          {submitError}
          <button onClick={() => setSubmitError('')} className="ml-4 text-white/60 hover:text-white">Close</button>
        </div>
      )}

      {confirmedOrder && (
        <OrderConfirmationModal
          show={true}
          orderNumber={confirmedOrder.orderNumber}
          items={confirmedOrder.items}
          address={confirmedOrder.address}
          city={confirmedOrder.city}
          total={confirmedOrder.total}
          paymentMethod={confirmedOrder.paymentMethod}
          onClose={() => {
            setConfirmedOrder(null)
            window.location.href = '/'
          }}
        />
      )}
    </>
  )
}
