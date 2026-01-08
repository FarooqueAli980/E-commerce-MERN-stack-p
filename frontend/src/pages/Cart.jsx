import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Tag, Shield } from "lucide-react";
import { removeFromCart, updateQuantity, clearCart } from "@/redux/cartSlice";
import { toast } from "sonner";

function Cart() {
  const { items, totalPrice, totalItems } = useSelector(store => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIncrement = (productId, currentQuantity, stock) => {
    if (currentQuantity < stock) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity + 1 }));
    } else {
      toast.error("Cannot exceed stock limit");
    }
  };

  const handleDecrement = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleRemove = (productId, productName) => {
    dispatch(removeFromCart(productId));
    toast.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    navigate("/checkout");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-32">
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8">
                <ShoppingCart className="h-20 w-20 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-10">Time to find something amazing!</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all px-8 py-6 text-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Shopping Cart</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">{totalItems} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-2xl text-gray-900">Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-6 p-5 bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Product Image */}
                    <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="grow">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹{item.price}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            Stock: {item.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-0 border-2 border-blue-300 rounded-full bg-white shadow-sm">
                        <button
                          onClick={() =>
                            handleDecrement(item._id, item.quantity)
                          }
                          className="p-2 hover:bg-blue-100 transition-colors text-gray-700 hover:text-blue-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold text-gray-900 text-lg">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleIncrement(item._id, item.quantity, item.stock)
                          }
                          className="p-2 hover:bg-blue-100 transition-colors text-gray-700 hover:text-blue-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total and Remove */}
                      <div className="text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemove(item._id, item.name)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping & Shipping Info */}
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-slate-600 to-slate-700 text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all px-6 py-3"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              
              {/* Shipping Benefits */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 flex items-center gap-3">
                  <Truck className="text-green-600 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-green-900">Free Shipping</p>
                    <p className="text-xs text-green-700">On orders above ₹500</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 flex items-center gap-3">
                  <Shield className="text-blue-600 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-blue-900">Secure</p>
                    <p className="text-xs text-blue-700">SSL Encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                {/* Subtotal */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping (mock) */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Shipping:</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">FREE</span>
                </div>

                {/* Tax (mock) */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Tax (18%):</span>
                  <span className="font-semibold text-gray-900">
                    ₹{(totalPrice * 0.18).toFixed(2)}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-900 font-semibold">🎉 First-time discount available at checkout</p>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total:</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{(totalPrice * 1.18).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all py-6 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Clear Cart Button */}
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="w-full cursor-pointer border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-lg py-6 hover:border-red-300 transition-all"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>

                {/* Promo Code (mock) */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    Promo Code (Coming Soon)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      disabled
                      className="text-sm bg-gray-100 cursor-not-allowed rounded-lg"
                    />
                    <Button
                      disabled
                      className="cursor-not-allowed bg-gray-300 rounded-lg"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
