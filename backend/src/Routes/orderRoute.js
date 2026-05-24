import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  createStripeSession,
  confirmStripePayment,
  uploadReceipt,
} from "../Controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.post("/:id/stripe-session", createStripeSession);
router.post("/:id/confirm-payment", confirmStripePayment);
router.post("/:id/receipt", uploadReceipt);

export default router;
