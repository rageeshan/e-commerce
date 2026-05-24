import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="w-14 h-14 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven't added anything yet. Browse our collections
            and find something you love!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const shipping = cartTotal >= 5000 ? 0 : 350;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-400 mt-1">
            {cart.reduce((s, i) => s + i.quantity, 0)} item
            {cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear cart button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div
                  className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="font-semibold text-gray-900 text-lg leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                          Size: {item.size}
                        </span>
                        {item.onSale && (
                          <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Sale
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.size)
                      }
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price + Quantity row */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Price */}
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-400 ml-2">
                          Rs. {item.price.toLocaleString()} each
                        </span>
                      )}
                      {item.onSale && item.originalPrice > item.price && (
                        <div>
                          <span className="text-sm text-gray-400 line-through">
                            Rs.{" "}
                            {(
                              item.originalPrice * item.quantity
                            ).toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600 ml-2 font-medium">
                            Save Rs.{" "}
                            {(
                              (item.originalPrice - item.price) *
                              item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.maxQuantity}
                        title={
                          item.quantity >= item.maxQuantity
                            ? `Max ${item.maxQuantity} in stock`
                            : undefined
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stock warning */}
                  {item.quantity >= item.maxQuantity && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠ Only {item.maxQuantity} left in stock for size{" "}
                      {item.size}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal (
                    {cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium text-gray-900">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={`font-medium ${
                      shipping === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add Rs. {(5000 - cartTotal).toLocaleString()} more for free
                    shipping
                  </p>
                )}

                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🚚</span>
                  <span>Free shipping on orders over Rs. 5,000</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>↩️</span>
                  <span>30-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
