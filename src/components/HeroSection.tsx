'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-etoi-cream to-white" />
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, #c9a96e 1px, transparent 1px), radial-gradient(circle at 75% 75%, #c9a96e 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-etoi-primary font-light leading-tight mb-6 tracking-tight"
          >
            Discover Your
            <br />
            <span className="text-etoi-secondary">Signature Scent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-etoi-secondary text-xs tracking-[0.3em] uppercase mb-8"
          >
            Artisanal Fragrances
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-etoi-gray text-sm md:text-base max-w-xl mb-10 leading-relaxed font-light"
          >
            Premium fragrances crafted from the finest ingredients, designed to
            leave a lasting impression.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/men"
              className="btn-primary w-full sm:w-auto text-center"
            >
              Shop Men
            </Link>
            <Link
              href="/women"
              className="btn-secondary w-full sm:w-auto text-center"
            >
              Shop Women
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-etoi-primary/20 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
