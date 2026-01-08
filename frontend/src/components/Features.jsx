import React from "react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      title: "Free Shipping",
      desc: "On orders over ₹500",
      icon: "🚚",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Secure Payment",
      desc: "100% secure transactions",
      icon: "🔒",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "24/7 Support",
      desc: "Always here to help you",
      icon: "💬",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Easy Returns",
      desc: "30-day return policy",
      icon: "↩️",
      color: "from-orange-500 to-red-600"
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Experience the best shopping with our premium features and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group border-2 border-blue-100 hover:border-blue-300`}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-br ${item.color} p-8 text-white text-center group-hover:shadow-lg transition-shadow`}>
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-slate-600 font-semibold text-lg">{item.desc}</p>
              </div>

              {/* Bottom accent */}
              <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${item.color}`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-3">Start Your Shopping Journey</h3>
          <p className="text-blue-100 mb-6">Join thousands of satisfied customers and get exclusive deals today!</p>
          <Button className="bg-white text-blue-600 font-bold px-10 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
            🛍️ Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
