'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a96e 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-etoi-primary font-light mb-4 tracking-tight">
            Let&apos;s Create Something
            <span className="text-etoi-secondary"> Memorable</span>
          </h2>
          <p className="text-etoi-gray text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Have a question about our fragrances or need a personalized
            recommendation? We&apos;d love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
            <a
              href="mailto:etoi.fragrances@gmail.com"
              className="btn-secondary"
            >
              Email Us
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-etoi-gray">
            <a
              href="mailto:etoi.fragrances@gmail.com"
              className="hover:text-etoi-secondary transition-colors duration-300"
            >
              etoi.fragrances@gmail.com
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="https://wa.me/923282147535"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-etoi-secondary transition-colors duration-300"
            >
              +92 328-2147535
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
