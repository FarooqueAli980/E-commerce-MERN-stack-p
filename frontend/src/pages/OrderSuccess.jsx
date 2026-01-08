import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("verifying");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setPaymentStatus("failed");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/v1/payment/verify-session/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data.success) {
          setOrder(res.data.order);
          setPaymentStatus("success");
          dispatch(clearCart());
          toast.success("Payment verified successfully!");
        } else {
          setPaymentStatus("failed");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        setPaymentStatus("failed");
        toast.error(error.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, accessToken, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-pink-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-pink-50 pt-20 pb-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-8 text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Please try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-pink-600 text-white cursor-pointer hover:bg-pink-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <Card className="mb-8">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm font-bold">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <p className="font-bold capitalize text-green-600">
                      {order.orderStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-bold capitalize text-green-600">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:pb-0 last:border-0">
                      <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold">{item.productName}</h3>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price}
                        </div>
                        <div className="font-semibold text-pink-600 mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600 mb-2">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                <p className="text-gray-600">
                  Phone: {order.shippingAddress.phone}
                  <br />
                  Email: {order.shippingAddress.email}
                </p>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="mb-8">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount Paid:</span>
                  <span className="text-pink-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/orders")}
                className="w-full bg-pink-600 text-white cursor-pointer hover:bg-pink-700"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full cursor-pointer"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderSuccess;
