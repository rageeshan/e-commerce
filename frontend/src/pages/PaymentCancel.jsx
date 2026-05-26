import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PaymentCancel() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("order_id");

  // Mark the order as cancelled when user lands here
  useEffect(() => {
    if (!orderId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    }).catch(console.error);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/payment-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "cancelled" }),
    }).catch(console.error);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-sm w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Cancelled</h2>
            <p className="text-gray-500 mt-2">Your payment was cancelled and your order has been voided.</p>
            {orderId && <p className="text-xs text-gray-400 mt-1 font-mono">Order ID: {orderId}</p>}
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/cart")}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Return to Cart
            </button>
            <button onClick={() => navigate("/")} className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
