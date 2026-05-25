import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  onSale: { type: Boolean, default: false },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    // Contact
    email: { type: String, required: true, trim: true, lowercase: true },

    // Delivery
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    address:   { type: String, required: true, trim: true },
    apartment: { type: String, trim: true, default: "" },
    city:      { type: String, required: true, trim: true },
    postalCode:{ type: String, trim: true, default: "" },
    phone:     { type: String, required: true, trim: true },

    // Shipping & Payment
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "card"],
      required: true,
    },

    // Items
    items: { type: [orderItemSchema], required: true },

    // Totals
    subtotal:      { type: Number, required: true },
    shippingCost:  { type: Number, required: true, default: 0 },
    totalAmount:   { type: Number, required: true },

    // Order status
    status: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "cancelled"],
      default: "confirmed",
    },

    // Payment status
    // cod              → Cash on Delivery (no online payment)
    // pending          → Bank transfer uploaded, awaiting admin verification
    // verified         → Admin verified bank transfer OR Stripe paid
    // cancelled        → Payment cancelled / failed
    paymentStatus: {
      type: String,
      enum: ["cod", "pending", "verified", "cancelled"],
      default: "pending",
    },
    stripeSessionId: { type: String, default: "" },
    receiptUrl:      { type: String, default: "" }, // Cloudinary URL for bank transfer receipt

    notes: { type: String, default: "" },
    stockReduced: { type: Boolean, default: false }, // true once stock has been deducted
  },
  { timestamps: true }
);

// Virtual: full name
orderSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
