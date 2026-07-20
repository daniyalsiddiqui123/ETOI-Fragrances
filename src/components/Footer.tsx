'use client'

import Link from 'next/link'
import { useState } from 'react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || subscribing) return
    setSubscribing(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    } catch {
      // silently fail
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl tracking-[0.3em] text-etoi-primary">
                ÉTOI
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-etoi-secondary uppercase font-light mt-1">
                Fragrances
              </span>
            </Link>
            <p className="text-sm text-etoi-gray leading-relaxed max-w-xs">
              Crafting exceptional fragrances that capture the essence of
              sophistication and timeless elegance. Each bottle tells a story of
              passion, artistry, and the finest ingredients from around the world.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-etoi-secondary mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-etoi-gray hover:text-etoi-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-etoi-secondary mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com/etoi.fragrances"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-etoi-gray hover:text-etoi-primary transition-colors duration-300 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:text-etoi-secondary transition-colors">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@etoi.fragrances"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-etoi-gray hover:text-etoi-primary transition-colors duration-300 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:text-etoi-secondary transition-colors">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-etoi-secondary mb-6">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:etoi.fragrances@gmail.com"
                  className="text-sm text-etoi-gray hover:text-etoi-primary transition-colors duration-300"
                >
                  etoi.fragrances@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923282147535"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-etoi-gray hover:text-etoi-primary transition-colors duration-300"
                >
                  +92 328-2147535
                </a>
              </li>
              <li className="text-sm text-etoi-gray">Pakistan</li>
            </ul>

            <div className="mt-6">
              <h5 className="text-xs tracking-[0.2em] uppercase text-etoi-gray/60 mb-3">
                Newsletter
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 bg-etoi-cream/50 border border-gray-200 px-3 py-2 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none focus:border-etoi-secondary transition-colors"
                />
                <button
                  type="submit"
                  className="bg-etoi-primary text-white px-4 py-2 text-sm font-medium hover:bg-etoi-secondary transition-colors duration-300"
                >
                  {subscribed ? '✓' : '→'}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-etoi-secondary mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-etoi-gray">
            &copy; {new Date().getFullYear()} ÉTOI Fragrances. All rights reserved.
          </p>
          <p className="text-xs text-etoi-gray/60">
            Crafted with care in Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
