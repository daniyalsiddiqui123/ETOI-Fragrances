import { HeroSection } from '@/components/HeroSection'
import { BestSellersSection } from '@/components/BestSellersSection'
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection'
import { ContactCTA } from '@/components/ContactCTA'
import { getProducts } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <HeroSection />
      <BestSellersSection products={products} />
      <WhyChooseUsSection />
      <ContactCTA />
    </>
  )
}
