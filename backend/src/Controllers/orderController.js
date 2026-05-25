import Stripe from "stripe";
import multer from "multer";
import { getCloudinary } from "../Config/cloudinary.js";
import Order from "../Models/orderModel.js";
import Product from "../Models/productModel.js";
import { sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderCancelledEmail } from "../Services/emailService.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SHIPPING_COSTS = { standard: 350, express: 850 };

// Lazy getter — dotenv is loaded before any request hits these functions
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// Multer: store file in memory, upload to Cloudinary manually
const memStorage = multer.memoryStorage();
export const receiptMulter = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, or PDF files are allowed"));
  },
}).single("receipt");

/* ─── Stock Reduction Helper ─── */
async function reduceStock(items) {
  for (const item of items) {
    try {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const sizeData = product.sizeAvailability?.[item.size];
      if (sizeData !== undefined) {
        const newQty = Math.max(0, (sizeData.quantity || 0) - item.quantity);
        product.sizeAvailability = {
          ...product.sizeAvailability,
          [item.size]: { quantity: newQty, available: newQty > 0 },
        };
        product.markModified("sizeAvailability");
        await product.save();
      }
    } catch (err) {
      console.error(`Stock reduce error for product ${item.productId}:`, err.message);
    }
  }
}

/* ─── Stock Restoration Helper (called on cancel) ─── */
async function restoreStock(items) {
  for (const item of items) {
    try {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const sizeData = product.sizeAvailability?.[item.size];
      if (sizeData !== undefined) {
        const newQty = (sizeData.quantity || 0) + item.quantity;
        product.sizeAvailability = {
          ...product.sizeAvailability,
          [item.size]: { quantity: newQty, available: newQty > 0 },
        };
        product.markModified("sizeAvailability");
        await product.save();
      }
    } catch (err) {
      console.error(`Stock restore error for product ${item.productId}:`, err.message);
    }
  }
}

/* ─────────────────────────────────────────────
   POST /api/orders  — Create order
   ───────────────────────────────────────────── */
export const createOrder = async (req, res) => {
  try {
    const {
      email, firstName, lastName, address, apartment,
      city, postalCode, phone,
      shippingMethod = "standard", paymentMethod,
      items, notes = "",
    } = req.body;

    if (!email || !firstName || !lastName || !address || !city || !phone)
      return res.status(400).json({ message: "Missing required contact or delivery fields" });
    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method is required" });
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Order must contain at least one item" });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = SHIPPING_COSTS[shippingMethod] ?? 350;
    const totalAmount = subtotal + shippingCost;

    // COD: paymentStatus = "cod", status = "confirmed", reduce stock immediately
    const isCOD = paymentMethod === "cod";

    const order = await Order.create({
      email, firstName, lastName, address,
      apartment: apartment || "", city,
      postalCode: postalCode || "", phone,
      shippingMethod, paymentMethod, items,
      subtotal, shippingCost, totalAmount, notes,
      status: "confirmed",
      paymentStatus: isCOD ? "cod" : "pending",
    });

    // Reduce stock for COD immediately and mark order
    if (isCOD) {
      await reduceStock(items);
      order.stockReduced = true;
      await order.save();

      // Send confirmation email for COD orders
      await sendOrderConfirmationEmail(order);
    }

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/orders/:id/stripe-session
   ───────────────────────────────────────────── */
export const createStripeSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "lkr",
        product_data: {
          name: `${item.name} (${item.size})`,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "lkr",
        product_data: { name: `Shipping (${order.shippingMethod})` },
        unit_amount: Math.round(order.shippingCost * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: order.email,
      metadata: { orderId: order._id.toString() },
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${FRONTEND_URL}/payment/cancel?order_id=${order._id}`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("createStripeSession error:", error);
    res.status(500).json({ message: "Failed to create payment session", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/orders/:id/confirm-payment
   Called from frontend after Stripe success redirect
   ───────────────────────────────────────────── */
export const confirmStripePayment = async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: "Session ID required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid")
      return res.status(400).json({ message: "Payment not completed" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "verified";
    order.status = "confirmed";
    order.stockReduced = true;
    await order.save();

    // Reduce stock after card payment confirmed
    await reduceStock(order.items);

    // Send confirmation email after Stripe payment
    await sendOrderConfirmationEmail(order);

    res.status(200).json({ message: "Payment confirmed", order });
  } catch (error) {
    console.error("confirmStripePayment error:", error);
    res.status(500).json({ message: "Failed to confirm payment", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/orders/:id/receipt  (multipart)
   Upload bank transfer receipt to Cloudinary
   ───────────────────────────────────────────── */
export const uploadReceipt = (req, res) => {
  receiptMulter(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Upload buffer to Cloudinary (lazy config ensures env vars are loaded)
      const cloudinary = getCloudinary();
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "stylehub/receipts", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      order.receiptUrl = uploadResult.secure_url;
      order.paymentStatus = "pending"; // awaiting admin verification
      order.status = "confirmed";
      order.stockReduced = true;
      await order.save();

      // Reduce stock after receipt submitted
      await reduceStock(order.items);

      // Send confirmation email for bank transfer orders after receipt upload
      await sendOrderConfirmationEmail(order);

      res.status(200).json({
        message: "Receipt uploaded successfully",
        receiptUrl: uploadResult.secure_url,
        order,
      });
    } catch (error) {
      console.error("uploadReceipt error:", error);
      res.status(500).json({ message: "Failed to upload receipt", error: error.message });
    }
  });
};

/* ─────────────────────────────────────────────
   GET /api/orders  — Admin: all orders
   ───────────────────────────────────────────── */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/orders/:id
   Supports full MongoDB _id  OR  the 8-char short display ID
   shown in emails (last 8 chars of _id, uppercase, e.g. "A1B0149F")
   ───────────────────────────────────────────── */
export const getOrderById = async (req, res) => {
  try {
    const raw = req.params.id.trim().replace(/^#/, ""); // strip leading '#' if present

    // 1) Try exact MongoDB ObjectId lookup first
    let order = null;
    if (/^[a-f0-9]{24}$/i.test(raw)) {
      order = await Order.findById(raw);
    }

    // 2) Fallback: match by 8-char short display ID (last 8 chars of _id, case-insensitive)
    if (!order && raw.length === 8) {
      const all = await Order.find({}).select("_id").lean();
      const matched = all.find(
        (o) => o._id.toString().slice(-8).toUpperCase() === raw.toUpperCase()
      );
      if (matched) {
        order = await Order.findById(matched._id);
      }
    }

    if (!order) return res.status(404).json({ message: "Order not found. Please check your Order ID." });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/orders/:id/status
   ───────────────────────────────────────────── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["confirmed", "processing", "shipped", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    // Fetch first to check current status
    const existing = await Order.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Order not found" });

    // Lock: cannot change status once shipped or cancelled
    if (existing.status === "shipped" || existing.status === "cancelled")
      return res.status(403).json({ message: `Order is already ${existing.status} and cannot be changed` });

    // Restore stock if cancelling and stock was previously reduced
    if (status === "cancelled" && existing.stockReduced) {
      await restoreStock(existing.items);
      existing.stockReduced = false;
    }

    existing.status = status;
    await existing.save();

    // Send email based on new status
    if (status === "shipped") {
      await sendOrderShippedEmail(existing);
    } else if (status === "cancelled") {
      await sendOrderCancelledEmail(existing);
    }

    res.status(200).json({ message: "Status updated", order: existing });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/orders/:id/payment-status
   Admin verifies bank transfer payment
   ───────────────────────────────────────────── */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const valid = ["pending", "verified", "cancelled", "cod"];
    if (!valid.includes(paymentStatus))
      return res.status(400).json({ message: "Invalid payment status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Restore stock if declining/cancelling and stock was previously reduced
    if (paymentStatus === "cancelled" && order.stockReduced) {
      await restoreStock(order.items);
      order.stockReduced = false;
    }

    order.paymentStatus = paymentStatus;
    if (paymentStatus === "cancelled") order.status = "cancelled";
    await order.save();

    // Send cancellation email when payment is declined/cancelled
    if (paymentStatus === "cancelled") {
      await sendOrderCancelledEmail(order);
    }

    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status", error: error.message });
  }
};
