import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ÉTOI Fragrances | Premium Luxury Fragrances',
    template: '%s | ÉTOI Fragrances',
  },
  description:
    'Discover ÉTOI Fragrances — a premium collection of artisanal perfumes crafted for men and women. Experience luxury, elegance, and sophistication in every bottle.',
  keywords: [
    'fragrance',
    'perfume',
    'luxury',
    'ÉTOI',
    'Pakistan perfume',
    'oud',
    'rose',
    'saffron',
  ],
  openGraph: {
    title: 'ÉTOI Fragrances | Premium Luxury Fragrances',
    description:
      'Discover ÉTOI Fragrances — a premium collection of artisanal perfumes crafted for men and women.',
    url: 'https://etoi-fragrances.vercel.app',
    siteName: 'ÉTOI Fragrances',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-etoi-cream font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
