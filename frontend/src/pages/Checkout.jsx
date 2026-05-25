import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  User, MapPin, Truck, CreditCard, ChevronRight,
  CheckCircle, ShieldCheck, Banknote, Wallet, Package,
  Upload, Loader2, FileCheck
} from "lucide-react";

const SHIPPING = { standard: 350, express: 850 };

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-300 transition-all";
const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  // Bank transfer state
  const [bankOrderId, setBankOrderId] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptDone, setReceiptDone] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    firstName: "", lastName: "", address: "",
    apartment: "", city: "", postalCode: "", phone: "",
    shippingMethod: "standard",
    paymentMethod: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const shippingCost = SHIPPING[form.shippingMethod];
  const total = cartTotal + shippingCost;

  if (cart.length === 0 && !orderPlaced && !bankOrderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <Package className="w-16 h-16 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500">Add some products before checking out.</p>
          <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validateForm = () => {
    const e = {};
    // Contact validation
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    // Delivery validation
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    // Payment validation
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      // Step 1: Always create the order first
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map(i => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            originalPrice: i.originalPrice,
            onSale: i.onSale,
            size: i.size,
            quantity: i.quantity,
            category: i.category,
          })),
          subtotal: cartTotal,
          shippingCost,
          totalAmount: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");
      const oid = data.order._id;

      // Step 2: Branch by payment method
      if (form.paymentMethod === "cod") {
        // COD — confirm immediately, clear cart, show success
        clearCart();
        setOrderId(oid);
        setOrderPlaced(true);

      } else if (form.paymentMethod === "bank_transfer") {
        // Bank Transfer — clear cart, show bank details + receipt upload
        clearCart();
        setBankOrderId(oid);

      } else if (form.paymentMethod === "card") {
        // Card — get Stripe session URL and redirect browser to Stripe
        const sRes = await fetch(`http://localhost:5001/api/orders/${oid}/stripe-session`, {
          method: "POST",
        });
        const sData = await sRes.json();
        if (!sRes.ok) throw new Error(sData.message || "Failed to create payment session");
        window.location.href = sData.url; // leaves the page → Stripe hosted checkout
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // uploadReceipt — bank transfer receipt to Cloudinary
  const uploadReceipt = async () => {
    if (!receiptFile || !bankOrderId) return;
    setUploadingReceipt(true);
    try {
      const fd = new FormData();
      fd.append("receipt", receiptFile);
      const res = await fetch(`http://localhost:5001/api/orders/${bankOrderId}/receipt`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setReceiptDone(true);
    } catch (err) { alert(err.message); }
    finally { setUploadingReceipt(false); }
  };

  // --- COD success screen ---
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="text-gray-500 mt-2">Pay on delivery. We will deliver to {form.city}.</p>
            {orderId && <p className="text-xs text-gray-400 mt-1 font-mono">Order: {orderId}</p>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-sm w-full text-sm text-left space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-semibold">Cash on Delivery</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-semibold capitalize">{form.shippingMethod}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-bold">Total</span><span className="font-bold text-indigo-600">Rs {total.toLocaleString()}</span></div>
          </div>
          <button onClick={() => navigate("/")} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Continue Shopping</button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Bank Transfer screen ---
  if (bankOrderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full space-y-6">
            {receiptDone ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Receipt Submitted!</h2>
                <p className="text-gray-500 text-sm">We will verify your payment and confirm your order within 24 hours.</p>
                <p className="text-xs font-mono text-gray-400">Order: {bankOrderId}</p>
                <button onClick={() => navigate("/")} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Continue Shopping</button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Bank Transfer Details</h2>
                  <p className="text-sm text-gray-400">Transfer the exact amount then upload your receipt</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3 text-sm">
                  {[
                    { l: "Bank", v: "Commercial Bank of Ceylon" },
                    { l: "Account Name", v: "StyleHub Pvt Ltd" },
                    { l: "Account Number", v: "8001234567" },
                    { l: "Branch", v: "Colombo 03" },
                    { l: "Amount", v: `Rs ${total.toLocaleString()}` },
                    { l: "Reference", v: bankOrderId.slice(-8).toUpperCase() },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between">
                      <span className="text-gray-500">{r.l}</span>
                      <span className="font-bold text-gray-800 font-mono">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Upload Payment Receipt *</label>
                  <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
                    <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                    {receiptFile
                      ? <p className="text-sm font-medium text-indigo-600">{receiptFile.name}</p>
                      : <p className="text-sm text-gray-400">Click to upload PNG, JPG or PDF</p>}
                    <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => setReceiptFile(e.target.files[0])} />
                  </div>
                </div>
                <button onClick={uploadReceipt} disabled={!receiptFile || uploadingReceipt}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {uploadingReceipt ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Submit Receipt"}
                </button>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const err = (k) => errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Form Panel (All fields on one page) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg"><User className="w-5 h-5 text-indigo-600" /></div>
                <h2 className="text-lg font-bold text-gray-900">Contact</h2>
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com" className={inputCls} />
                {err("email")}
              </div>
            </div>

            {/* Delivery Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg"><MapPin className="w-5 h-5 text-indigo-600" /></div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="John" className={inputCls} />
                  {err("firstName")}
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Doe" className={inputCls} />
                  {err("lastName")}
                </div>
              </div>
              <div>
                <label className={labelCls}>Address *</label>
                <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main Street" className={inputCls} />
                {err("address")}
              </div>
              <div>
                <label className={labelCls}>Apartment, suite, etc. <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
                <input value={form.apartment} onChange={e => set("apartment", e.target.value)} placeholder="Apt 4B" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>City *</label>
                  <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Colombo" className={inputCls} />
                  {err("city")}
                </div>
                <div>
                  <label className={labelCls}>Postal Code <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
                  <input value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="00100" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone *</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+94 77 123 4567" className={inputCls} />
                {err("phone")}
              </div>
            </div>

            {/* Shipping & Payment Section */}
            <div className="space-y-5">
              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Truck className="w-5 h-5 text-indigo-600" /></div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", desc: "3–5 business days", price: 350, icon: "🚚" },
                    { id: "express", label: "Express Delivery", desc: "1–2 business days", price: 850, icon: "⚡" },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${form.shippingMethod === opt.id ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                      }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shippingMethod" value={opt.id} checked={form.shippingMethod === opt.id}
                          onChange={e => set("shippingMethod", e.target.value)} className="accent-indigo-600 w-4 h-4" />
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">Rs {opt.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><CreditCard className="w-5 h-5 text-indigo-600" /></div>
                  <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: <Banknote className="w-5 h-5 text-green-600" /> },
                    { id: "bank_transfer", label: "Bank Transfer", desc: "Transfer to our bank account", icon: <Wallet className="w-5 h-5 text-blue-600" /> },
                    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: <CreditCard className="w-5 h-5 text-purple-600" /> },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === opt.id ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                      }`}>
                      <input type="radio" name="paymentMethod" value={opt.id} checked={form.paymentMethod === opt.id}
                        onChange={e => set("paymentMethod", e.target.value)} className="accent-indigo-600 w-4 h-4" />
                      <div className="p-2 bg-gray-50 rounded-lg">{opt.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {err("paymentMethod")}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className={labelCls}>Order Notes <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows="3"
                  placeholder="Special instructions for delivery..." className={`${inputCls} resize-none`} />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order..." : "Place Order 🎉"}
            </button>
          </div>

          {/* --- Order Summary Panel --- */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100" onError={e => { e.target.src = "https://via.placeholder.com/56"; }} />
                        : <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Size: {item.size}</p>
                    </div>
                    <p className="font-semibold text-sm text-gray-900 flex-shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>Rs {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping ({form.shippingMethod})</span>
                  <span>Rs {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-3 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">Rs {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Secure checkout. Your information is protected.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}