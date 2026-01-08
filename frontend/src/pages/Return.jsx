import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";

function Return() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      console.log("❌ No session_id found in URL");
      setStatus("failed");
      setLoading(false);
      return;
    }

    const checkSessionStatus = async () => {
      try {
        setLoading(true);
        console.log("🔍 Checking session status for:", sessionId);
        
        const url = `http://localhost:8000/api/v1/payment/session-status?session_id=${sessionId}`;
        console.log("📡 Calling API:", url);
        
        const response = await fetch(url);
        
        console.log("📨 Response status:", response.status, response.statusText);
        console.log("📨 Response headers:", {
          contentType: response.headers.get('content-type'),
        });
        
        if (!response.ok) {
          const text = await response.text();
          console.log("❌ Response body (first 500 chars):", text.substring(0, 500));
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        console.log("📊 Complete session response:", JSON.stringify(data, null, 2));
        console.log("   - status:", data.status);
        console.log("   - success:", data.success);
        console.log("   - customer_email:", data.customer_email);

        if (data.status === "paid" || data.success === true) {
          console.log("✅ PAYMENT SUCCESSFUL - Setting status to complete");
          setStatus("complete");
          setCustomerEmail(data.customer_email || "");
          dispatch(clearCart());
          toast.success("Payment successful!");
        } else if (data.status === "open") {
          console.log("⏳ Payment still open, user likely cancelled");
          toast.info("Payment was cancelled");
          navigate("/checkout");
        } else {
          console.log("❌ PAYMENT FAILED - Status is:", data.status);
          setStatus("failed");
          toast.error(`Payment was not completed. Status: ${data.status}`);
        }
      } catch (error) {
        setStatus("failed");
        console.error("❌ FATAL ERROR checking session status:", error);
        console.error("   Full error:", error);
        toast.error("Error verifying payment: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSessionStatus();
  }, [sessionId, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-pink-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
        </div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="min-h-screen bg-white pt-20 pb-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mb-2">
                We appreciate your business! A confirmation email will be sent to{" "}
                <span className="font-semibold">{customerEmail}</span>.
              </p>
              <p className="text-gray-600 mb-6">
                If you have any questions, please email us at{" "}
                <a href="mailto:orders@example.com" className="text-pink-600 hover:underline">
                  orders@example.com
                </a>
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-8 text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/cart")}
                variant="outline"
                className="w-full cursor-pointer"
              >
                Back to Cart
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

export default Return;
