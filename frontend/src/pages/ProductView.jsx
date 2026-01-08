import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Loader2, Heart, ChevronLeft, Share2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

function ProductView() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/all`
      );

      if (res.data.success) {
        const foundProduct = res.data.products.find(p => p._id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error("Product not found");
          navigate("/products");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch product details");
      console.error(error);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("Product out of stock");
      return;
    }

    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity} × ${product.name} added to cart!`);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const rating = Math.round(product.rating || 0);
  const reviewCount = product.reviews?.length || 0;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        {/* Product Container */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full border border-blue-200">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-700">
                  {product.rating?.toFixed(1) || "N/A"}
                </span>
              </div>
              <span className="text-slate-600">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price Section */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-slate-600">
                Free shipping on orders over ₹1,000
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                About this product
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Stock Available: </span>
                <span
                  className={`font-bold ${
                    inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {inStock ? `${product.stock} items` : "Out of Stock"}
                </span>
              </p>
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-slate-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-50 transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-slate-900 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  inStock
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={20} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                onClick={handleWishlist}
                className={`px-6 py-3 font-semibold rounded-lg transition-all border ${
                  isWishlisted
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-slate-600 border-gray-300 hover:border-slate-400"
                }`}
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-current" : ""}
                />
              </Button>

              <Button
                onClick={handleShare}
                className="px-6 py-3 font-semibold rounded-lg transition-all border bg-white text-slate-600 border-gray-300 hover:border-slate-400"
              >
                <Share2 size={20} />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-1">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">30-Day Money Back</p>
                  <p className="text-sm text-slate-600">If you're not completely satisfied</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-1">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">Fast & Free Shipping</p>
                  <p className="text-sm text-slate-600">On orders over ₹1,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-1">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">24/7 Customer Support</p>
                  <p className="text-sm text-slate-600">Dedicated support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviewCount > 0 && (
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Customer Reviews
            </h2>
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={`${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {product.rating?.toFixed(1) || "N/A"} out of 5
                    </p>
                    <p className="text-slate-600">
                      Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Individual Reviews */}
            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
              {product.reviews?.slice(0, 3).map((review, idx) => (
                <Card key={idx} className="bg-gray-50 border border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">
                        {review.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">
                            {review.userName || "Anonymous"}
                          </p>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < (review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {reviewCount > 3 && (
              <p className="text-center text-slate-600 mt-4">
                +{reviewCount - 3} more reviews
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductView;
