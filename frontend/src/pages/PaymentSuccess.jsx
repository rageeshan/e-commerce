import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [order, setOrder] = useState(null);

  const sessionId = params.get("session_id");
  const orderId = params.get("order_id");

  useEffect(() => {
    if (!sessionId || !orderId) { setStatus("error"); return; }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.order) {
          setOrder(data.order);
          setStatus("success");
          clearCart(); // ✅ Clear the cart after successful card payment
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        {status === "loading" && (
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <p className="text-gray-500 font-medium">Confirming your payment...</p>
          </div>
        )}
        {status === "error" && (
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
            <p className="text-gray-500">Could not verify your payment. Contact support.</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">Go Home</button>
          </div>
        )}
        {status === "success" && order && (
          <div className="text-center space-y-5 max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Payment Successful! 🎉</h2>
              <p className="text-gray-500 mt-1">Your order has been confirmed.</p>
              <p className="text-xs text-gray-400 mt-1 font-mono">Order: {order._id}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{order.firstName} {order.lastName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold">{order.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-semibold">{order.city}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="font-bold text-gray-900">Total Paid</span><span className="font-bold text-indigo-600">Rs {order.totalAmount?.toLocaleString()}</span></div>
            </div>
            <button onClick={() => navigate("/")} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">Continue Shopping</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
