import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("stylehub_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem("stylehub_cart", JSON.stringify(cart));
  }, [cart]);

  /* ─── Derived values ─── */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ─── Actions ─── */

  /**
   * Add a product to the cart.
   * @param {Object} product   - full product document from backend
   * @param {string} size      - selected size
   * @param {number} quantity  - quantity to add (default 1)
   */
  function addToCart(product, size, quantity = 1) {
    if (!size) {
      toast.error("Please select a size first!");
      return false;
    }

    const sizeData = product.sizeAvailability?.[size];
    if (!sizeData || !sizeData.available || sizeData.quantity <= 0) {
      toast.error(`Size ${size} is out of stock!`);
      return false;
    }

    const maxQty = sizeData.quantity;
    const effectivePrice =
      product.onSale && product.salePrice ? product.salePrice : product.price;

    // First image URL
    const firstImage =
      product.image && product.image.length > 0 && !product.image[0].includes("…")
        ? `http://localhost:5001/uploads/${encodeURIComponent(product.image[0])}`
        : null;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product._id && item.size === size
      );

      if (existingIdx !== -1) {
        // Already in cart — increment, cap at stock
        const existing = prev[existingIdx];
        const newQty = Math.min(existing.quantity + quantity, maxQty);

        if (newQty === existing.quantity) {
          toast.error(`Maximum available stock (${maxQty}) already in cart!`);
          return prev;
        }

        const updated = [...prev];
        updated[existingIdx] = { ...existing, quantity: newQty };
        toast.success(`${product.name} (${size}) quantity updated!`);
        return updated;
      }

      // New cart line
      const newItem = {
        productId: product._id,
        name: product.name,
        image: firstImage,
        price: effectivePrice,
        originalPrice: product.price,
        onSale: product.onSale,
        size,
        quantity: Math.min(quantity, maxQty),
        maxQuantity: maxQty,
        category: product.category,
      };

      toast.success(`${product.name} (${size}) added to cart!`);
      return [...prev, newItem];
    });

    return true;
  }

  /**
   * Remove a specific size line from the cart.
   */
  function removeFromCart(productId, size) {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
    toast.success("Item removed from cart");
  }

  /**
   * Update quantity for a specific cart line.
   */
  function updateQuantity(productId, size, newQty) {
    if (newQty < 1) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size) {
          const clamped = Math.min(newQty, item.maxQuantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  }

  /**
   * Clear the entire cart.
   */
  function clearCart() {
    setCart([]);
    toast.success("Cart cleared");
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
