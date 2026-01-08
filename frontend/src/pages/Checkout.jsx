import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "@/redux/cartSlice";
import { StripeCheckout } from "@/components/StripeCheckout";

function Checkout() {
  const { items, totalPrice } = useSelector(store => store.cart);
  const { user } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    state: "",
    zipCode: user?.zipCode || "",
    country: "India",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-10 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8">
              <MapPin className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add items to proceed with checkout</p>
          <Button
            onClick={() => navigate("/cart")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all px-8 py-6 text-lg rounded-full font-bold"
          >
            🛒 Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!formData.address || !formData.city || !formData.zipCode) {
      toast.error("Please complete your address");
      return false;
    }
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Transform items to match backend schema
      const transformedItems = items.map(item => ({
        productId: item._id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      console.log("📤 Sending checkout request with items:", transformedItems);
      console.log("📤 Subtotal:", totalPrice);
      console.log("📤 Shipping Address:", formData);

      // Create checkout session with embedded UI mode
      const res = await axios.post(
        "http://localhost:8000/api/v1/payment/checkout-session",
        {
          items: transformedItems,
          shippingAddress: formData,
          subtotal: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("✅ Checkout session created successfully");
      console.log("   Response status:", res.status);
      console.log("   Client Secret:", res.data.clientSecret?.substring(0, 30) + "...");
      console.log("   Session ID:", res.data.sessionId);

      if (res.data.success) {
        setClientSecret(res.data.clientSecret);
        setShowForm(false);
        toast.success("Proceeding to payment...");
      } else {
        throw new Error(res.data.message || "Unexpected response from server");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create payment";
      console.error("   Error details:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tax = Math.round(totalPrice * 0.18 * 100) / 100;
  const total = totalPrice + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Checkout</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {showForm ? (
              // Shipping Form
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="grid gap-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>

                    {/* City, State, Zip */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="New York"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="NY"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zipCode">Zip Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 mt-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              // Embedded Stripe Checkout
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <StripeCheckout clientSecret={clientSecret} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>₹0.00</span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-pink-600">₹{total.toFixed(2)}</span>
                </div>

                {!showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    className="w-full mt-4 cursor-pointer"
                  >
                    Change Address
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
