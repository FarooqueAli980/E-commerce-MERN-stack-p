import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Star, Loader2, Search, X, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/redux/cartSlice";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    applyFilters();
  }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/product/all");

      if (res.data.success) {
        setAllProducts(res.data.products);
        
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error("Product out of stock");
      return;
    }
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([0, 100000]);
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            All Products
          </h1>
          <p className="text-slate-600">
            Browse our complete collection of {allProducts.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-600">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 pt-2">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>

              {/* Filter Stats */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-bold text-blue-600">{filteredProducts.length}</span> of{" "}
                  <span className="font-bold text-blue-600">{allProducts.length}</span> products
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all bg-white border border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-700">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4">
                      {/* Category Badge */}
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-2 border border-blue-200">
                        {product.category}
                      </span>

                      {/* Product Name */}
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 ml-2">
                          ({product.reviews?.length || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{product.price}
                        </span>
                      </div>

                      {/* Stock Info */}
                      <p className="text-sm text-slate-600 mb-4">
                        Stock:{" "}
                        <span
                          className={`font-semibold ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock > 0 ? product.stock : "Out of Stock"}
                        </span>
                      </p>

                      {/* Add to Cart Button */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`flex-1 flex items-center justify-center gap-2 cursor-pointer font-semibold rounded-lg transition-all ${
                            product.stock === 0
                              ? "bg-gray-200 cursor-not-allowed text-gray-400"
                              : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {product.stock === 0 ? "Out of Stock" : "Add"}
                        </Button>

                        <Button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 cursor-pointer font-semibold rounded-lg transition-all"
                        >
                          <Eye className="h-5 w-5" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <X className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your filters or search term
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold rounded-lg"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
