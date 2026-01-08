import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Loader2, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/redux/cartSlice";

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/product/all");

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error("Product out of stock");
      return;
    }
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Featured Products
          </h2>
          <p className="text-slate-600 text-lg font-medium">
            Discover our latest collection of premium products
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden bg-white border border-blue-100 shadow-md hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group h-full flex flex-col"
              >
                {/* Product Image - Compact */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {/* Sale Badge */}
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info - Compact */}
                <CardContent className="p-3 flex-grow flex flex-col justify-between">
                  {/* Category Badge */}
                  <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full mb-2 border border-blue-200 w-fit">
                    {product.category}
                  </span>

                  {/* Product Name */}
                  <h3 className="font-bold text-sm mb-1 line-clamp-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < Math.round(product.rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-600">
                      ({product.reviews?.length || 0})
                    </span>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{product.price}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 ? `${product.stock} left` : "Out"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 cursor-pointer font-semibold text-sm py-2 rounded-lg transition-all transform hover:scale-105 ${
                        product.stock === 0
                          ? "bg-gray-200 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white border-0"
                      }`}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>

                    <Button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="flex-1 cursor-pointer font-semibold text-sm py-2 rounded-lg bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 transition-all transform hover:scale-105"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">
              {error || "No products available yet"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;
