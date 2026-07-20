'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Artisanal Craftsmanship',
    description:
      'Each fragrance is meticulously blended by master perfumers using time-honored techniques passed down through generations.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Finest Ingredients',
    description:
      'We source the rarest oils and absolutes from Grasse, Oman, and beyond — ensuring uncompromising quality in every bottle.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
      </svg>
    ),
  },
  {
    title: 'Luxury Packaging',
    description:
      'Every order arrives in our signature packaging — a presentation as refined as the fragrance within.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="3" y1="3" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Premium Service',
    description:
      'From personalized recommendations to complimentary samples, we are dedicated to your fragrance journey.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Why Choose ÉTOI</h2>
          <p className="section-subtitle">
            The art of fine fragrance, perfected
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-8 text-center group hover:-translate-y-1 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-etoi-primary/5 text-etoi-secondary mb-6 group-hover:bg-etoi-secondary group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="font-serif text-lg text-etoi-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
