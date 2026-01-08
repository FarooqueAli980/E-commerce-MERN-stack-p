import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 py-16 px-6 md:px-20 border-t-4 border-blue-500">

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Logo + About */}
          <div>
            <div className="flex items-center gap-3 mb-5 group">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h18l-1.5 14.25a2.25 2.25 0 01-2.244 2.003H6.744A2.25 2.25 0 014.5 17.25L3 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">EKART</h2>
            </div>

            <p className="text-slate-400 mb-4 leading-relaxed">
              Your ultimate destination for premium electronics and gadgets at unbeatable prices.
            </p>

            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <span className="text-blue-400">📍</span> 123 Electronics St, Tech City, NY 10001
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-400">📧</span> support@ekart.com
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-400">📱</span> 1-800-EKART-123
              </p>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="text-blue-400">⚙️</span>
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Contact Us</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Shipping & Returns</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">FAQs</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Order Tracking</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Warranty Info</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="text-blue-400">ℹ️</span>
              About Us
            </h3>
            <ul className="space-y-3">
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Our Story</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Careers</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Press</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Blog</li>
              <li className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors duration-300 transform hover:translate-x-2">Sustainability</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="text-blue-400">📬</span>
              Stay Updated
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Get exclusive deals and latest product updates delivered to your inbox.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-3 w-full rounded-lg bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg px-6 py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all transform hover:scale-110">
                <span className="text-lg">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all transform hover:scale-110">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all transform hover:scale-110">
                <span className="text-lg">𝕏</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-slate-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2025 <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-bold">EKART</span>. All rights reserved
          </p>

          <div className="flex gap-8 text-sm">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Cookie Settings</a>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="text-slate-400">🔒 Secure Payments</span>
            <span className="text-slate-400">✅ Verified Seller</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
