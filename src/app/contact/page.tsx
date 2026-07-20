'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Toast } from '@/components/Toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.subject.trim()) errs.subject = 'Subject is required'
    if (!formData.message.trim()) errs.message = 'Message is required'
    else if (formData.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')
      setToast({ message: 'Message sent successfully! We\'ll get back to you soon.', type: 'success' })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Something went wrong',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-white relative">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a96e 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-etoi-secondary text-xs tracking-[0.3em] uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-etoi-primary font-light mb-4">
              Contact Us
            </h1>
            <p className="text-etoi-gray text-sm max-w-lg">
              Have a question about our fragrances or need assistance with your
              order? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full bg-white/50 border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full bg-white/50 border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white/50 border border-gray-200 px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none focus:border-etoi-primary transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={`w-full bg-white/50 border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors ${
                        errors.subject ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Your Message *"
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full bg-white/50 border px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                      errors.message ? 'border-red-400' : 'border-gray-200 focus:border-etoi-primary'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-serif text-xl text-etoi-primary mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-etoi-primary">Email</p>
                      <a
                        href="mailto:etoi.fragrances@gmail.com"
                        className="text-sm text-etoi-gray hover:text-etoi-secondary transition-colors"
                      >
                        etoi.fragrances@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-etoi-primary">Phone</p>
                      <a
                        href="https://wa.me/923282147535"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-etoi-gray hover:text-etoi-secondary transition-colors"
                      >
                        +92 328-2147535
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-etoi-primary">Location</p>
                      <p className="text-sm text-etoi-gray">Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h4 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/etoi.fragrances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-etoi-secondary hover:border-etoi-secondary transition-all duration-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com/@etoi.fragrances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-etoi-secondary hover:border-etoi-secondary transition-all duration-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  )
}
