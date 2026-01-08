import FeaturesSection from '@/components/Features'
import Hero from '@/components/Hero'
import ProductsSection from '@/components/ProductsSection'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero/>
      <ProductsSection/>
      <FeaturesSection/>
    </div>
  )
}

export default Home
