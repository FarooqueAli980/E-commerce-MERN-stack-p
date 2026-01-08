import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900 py-24 border-b-4 border-blue-200 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Grid Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left Text Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-300">
                🎉 SUMMER SALE - Up to 50% OFF
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Premium Tech
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  At Best Prices
                </span>
              </h1>

              <p className="text-xl text-slate-700 leading-relaxed font-medium max-w-xl">
                🚀 Discover cutting-edge technology with unbeatable deals on smartphones,
                laptops, gadgets, and accessories. Enterprise-grade quality with premium support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl text-white font-bold px-10 py-6 rounded-full cursor-pointer transition-all transform hover:scale-105 text-lg flex items-center gap-2">
                🛒 Shop Now
              </Button>

              <Button
                className="border-2 border-gradient-to-r from-blue-600 to-indigo-600 bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 py-6 rounded-full cursor-pointer transition-all transform hover:scale-105 text-lg"
              >
                ⚡ View Deals
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-8 pt-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="font-semibold text-slate-700">100% Authentic</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <p className="font-semibold text-slate-700">Free Shipping</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <p className="font-semibold text-slate-700">Secure Payment</p>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative flex justify-center items-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-blue-300 to-purple-300 opacity-15 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-pink-300 to-red-300 opacity-15 blur-3xl rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <img
              src="/hero.png"
              alt="Hero Banner"
              className="w-[90%] md:w-[450px] rounded-2xl shadow-2xl relative z-10 border-4 border-blue-200 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-3xl"
            />
          </div>

        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mt-20 p-8 bg-white rounded-2xl shadow-xl border-2 border-blue-100">
          <div className="text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">10K+</h3>
            <p className="text-slate-600 font-semibold">Products</p>
          </div>
          <div className="text-center border-l-2 border-r-2 border-blue-200">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">50K+</h3>
            <p className="text-slate-600 font-semibold">Happy Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">24/7</h3>
            <p className="text-slate-600 font-semibold">Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
