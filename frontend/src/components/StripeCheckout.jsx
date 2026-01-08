import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51SXdvQAiHdjcfUngmKObOjpCCDpnyOx9oM8kemadwVPeetbVsRNjzfOEan3ZTOR7kfLLwWNybLeudmHuwDC4dM9300ctxEj9Ci"
);

export const StripeCheckout = ({ clientSecret }) => {
  useEffect(() => {
    if (clientSecret) {
      console.log("✅ StripeCheckout received clientSecret:", clientSecret.substring(0, 30) + "...");
    }
  }, [clientSecret]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 text-center">
          <p className="font-semibold mb-2">Initializing payment...</p>
          <p className="text-sm">Please wait while we prepare the payment form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
