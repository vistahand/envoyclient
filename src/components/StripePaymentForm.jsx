import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import LoadingScreen from "./LoadingScreen";

// This component will be wrapped by the Elements provider
const CheckoutForm = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsLoading(true);

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      onPaymentError(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      onPaymentSuccess(paymentIntent);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />

      {message && (
        <div className="mt-4 text-sm font-medium text-red-600">{message}</div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className={`mt-6 w-full bg-primary text-white py-3.5 rounded-full
                  ${isLoading || !stripe || !elements ? "opacity-70" : ""}`}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// This is the wrapper component that loads Stripe and provides the Elements context
const StripePaymentForm = ({
  clientSecret,
  publishableKey,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  if (!clientSecret || !stripePromise) {
    return <LoadingScreen />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default StripePaymentForm;
