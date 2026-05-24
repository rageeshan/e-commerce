import React, { useState } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:5001/api";

/* ── Status timeline config ── */
const ORDER_STEPS = [
  { key: "confirmed",  label: "Order Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing",      icon: Package },
  { key: "shipped",    label: "Shipped",         icon: Truck },
];

const STATUS_COLORS = {
  confirmed:  { bg: "rgba(16,185,129,0.12)", text: "#059669", border: "#6ee7b7" },
  processing: { bg: "rgba(99,102,241,0.12)",  text: "#6366f1", border: "#a5b4fc" },
  shipped:    { bg: "rgba(245,158,11,0.12)",  text: "#d97706", border: "#fcd34d" },
  cancelled:  { bg: "rgba(239,68,68,0.12)",   text: "#dc2626", border: "#fca5a5" },
};

const PAYMENT_LABELS = {
  cod:       { label: "Cash on Delivery", color: "#6366f1" },
  pending:   { label: "Payment Pending",  color: "#d97706" },
  verified:  { label: "Payment Verified", color: "#059669" },
  cancelled: { label: "Payment Cancelled",color: "#dc2626" },
};

const SHIPPING_LABELS = { standard: "Standard Delivery", express: "Express Delivery" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString()}`;
}

/* ── Step Timeline ── */
function StatusTimeline({ status }) {
  const isCancelled = status === "cancelled";
  const currentIdx  = ORDER_STEPS.findIndex((s) => s.key === status);

  return (
    <div style={styles.timeline}>
      {isCancelled ? (
        <div style={styles.cancelledBanner}>
          <XCircle size={22} color="#dc2626" />
          <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 15 }}>
            This order has been cancelled
          </span>
        </div>
      ) : (
        <div style={styles.timelineSteps}>
          {ORDER_STEPS.map((step, i) => {
            const done    = i <= currentIdx;
            const Icon    = step.icon;
            const isLast  = i === ORDER_STEPS.length - 1;
            return (
              <React.Fragment key={step.key}>
                <div style={styles.stepCol}>
                  <div style={{
                    ...styles.stepCircle,
                    background: done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f3f4f6",
                    boxShadow: done ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                  }}>
                    <Icon size={18} color={done ? "#fff" : "#9ca3af"} />
                  </div>
                  <span style={{ ...styles.stepLabel, color: done ? "#111827" : "#9ca3af", fontWeight: done ? 700 : 400 }}>
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div style={{ ...styles.connector, background: i < currentIdx ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#e5e7eb" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Order Item Row ── */
function OrderItem({ item }) {
  return (
    <div style={styles.itemRow}>
      {item.image ? (
        <img src={item.image} alt={item.name} style={styles.itemImg} />
      ) : (
        <div style={styles.itemImgPlaceholder}>
          <ShoppingBag size={20} color="#9ca3af" />
        </div>
      )}
      <div style={styles.itemInfo}>
        <span style={styles.itemName}>{item.name}</span>
        <span style={styles.itemMeta}>Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}</span>
        {item.onSale && item.originalPrice && (
          <span style={styles.saleTag}>SALE</span>
        )}
      </div>
      <div style={styles.itemPrice}>
        <span style={styles.itemPriceMain}>{formatCurrency(item.price * item.quantity)}</span>
        {item.onSale && item.originalPrice && (
          <span style={styles.itemPriceOld}>{formatCurrency(item.originalPrice * item.quantity)}</span>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function TrackOrder() {
  const [orderId, setOrderId]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [order,   setOrder]     = useState(null);
  const [error,   setError]     = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    const id = orderId.trim();
    if (!id) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res  = await fetch(`${API_BASE}/orders/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Order not found. Please check your Order ID.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors  = order ? (STATUS_COLORS[order.status]  || STATUS_COLORS.confirmed)  : null;
  const paymentInfo   = order ? (PAYMENT_LABELS[order.paymentStatus] || { label: order.paymentStatus, color: "#6366f1" }) : null;

  return (
    <div style={styles.page}>
      <Header />

      <main style={styles.main}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroBadge}>
              <Truck size={16} color="#6366f1" />
              <span>Real-time Tracking</span>
            </div>
            <h1 style={styles.heroTitle}>Track Your Order</h1>
            <p style={styles.heroSub}>
              Enter your Order ID to get live updates on your delivery status.
            </p>

            {/* Search Form */}
            <form onSubmit={handleTrack} style={styles.searchForm}>
              <div style={styles.searchBox}>
                <Search size={20} color="#9ca3af" style={{ flexShrink: 0 }} />
                <input
                  id="order-id-input"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Paste your Order ID here…"
                  style={styles.searchInput}
                  autoFocus
                />
              </div>
              <button
                id="track-order-btn"
                type="submit"
                disabled={loading || !orderId.trim()}
                style={{
                  ...styles.trackBtn,
                  opacity: loading || !orderId.trim() ? 0.65 : 1,
                  cursor: loading || !orderId.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Search size={18} />
                )}
                {loading ? "Searching…" : "Track Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorCard}>
            <AlertCircle size={22} color="#dc2626" />
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div style={styles.detailsWrap}>

            {/* ─── Header Strip ─── */}
            <div style={styles.orderHeader}>
              <div>
                <p style={styles.orderIdLabel}>Order ID</p>
                <p style={styles.orderIdValue}>{order._id}</p>
                <p style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{ ...styles.badge, background: statusColors.bg, color: statusColors.text, border: `1px solid ${statusColors.border}` }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span style={{ ...styles.badge, background: "rgba(99,102,241,0.1)", color: paymentInfo.color, border: `1px solid ${paymentInfo.color}40` }}>
                  {paymentInfo.label}
                </span>
              </div>
            </div>

            {/* ─── Timeline ─── */}
            <StatusTimeline status={order.status} />

            {/* ─── Two-col grid ─── */}
            <div style={styles.grid}>

              {/* Customer Info */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}><MapPin size={16} /> Delivery Details</h3>
                <div style={styles.infoList}>
                  <Row label="Name"    value={`${order.firstName} ${order.lastName}`} />
                  <Row label="Address" value={[order.address, order.apartment, order.city, order.postalCode].filter(Boolean).join(", ")} />
                  <Row label="Shipping" value={SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod} />
                </div>
                <div style={styles.contactRow}>
                  <div style={styles.contactChip}>
                    <Mail size={14} color="#6366f1" />
                    <span>{order.email}</span>
                  </div>
                  <div style={styles.contactChip}>
                    <Phone size={14} color="#6366f1" />
                    <span>{order.phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}><CreditCard size={16} /> Payment Summary</h3>
                <div style={styles.infoList}>
                  <Row label="Payment Method" value={order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "card" ? "Card (Stripe)" : "Bank Transfer"} />
                  <Row label="Subtotal"        value={formatCurrency(order.subtotal)} />
                  <Row label="Shipping"        value={formatCurrency(order.shippingCost)} />
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Amount</span>
                  <span style={styles.totalValue}>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* ─── Items ─── */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><ShoppingBag size={16} /> Order Items ({order.items?.length || 0})</h3>
              <div style={styles.itemsList}>
                {order.items?.map((item, i) => (
                  <OrderItem key={i} item={item} />
                ))}
              </div>
            </div>

            {/* ─── Notes ─── */}
            {order.notes && (
              <div style={{ ...styles.card, background: "rgba(99,102,241,0.04)" }}>
                <h3 style={styles.cardTitle}>📝 Order Notes</h3>
                <p style={{ color: "#4b5563", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{order.notes}</p>
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        #order-id-input::placeholder { color: #9ca3af; }
        #order-id-input:focus { outline: none; }
      `}</style>
    </div>
  );
}

/* ── Helper row component ── */
function Row({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

/* ══════════════ Styles ══════════════ */
const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  main: { flex: 1 },

  /* Hero */
  hero: { background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#4c1d95 100%)", padding: "64px 20px 80px", textAlign: "center" },
  heroInner: { maxWidth: 640, margin: "0 auto" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#c4b5fd", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)", marginBottom: 20 },
  heroTitle: { color: "#fff", fontSize: "clamp(28px,5vw,46px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" },
  heroSub: { color: "#a5b4fc", fontSize: 16, margin: "0 0 36px", lineHeight: 1.6 },

  /* Search */
  searchForm: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  searchBox: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.95)", borderRadius: 14, padding: "14px 20px", flex: "1 1 300px", maxWidth: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" },
  searchInput: { flex: 1, border: "none", background: "transparent", fontSize: 15, color: "#111827", fontFamily: "inherit" },
  trackBtn: { display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", boxShadow: "0 6px 24px rgba(99,102,241,0.45)", transition: "transform .15s,box-shadow .15s", flexShrink: 0 },

  /* Error */
  errorCard: { maxWidth: 680, margin: "32px auto 0", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 14, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 },
  errorText: { color: "#dc2626", fontSize: 14, fontWeight: 500 },

  /* Details wrapper */
  detailsWrap: { maxWidth: 900, margin: "40px auto 60px", padding: "0 20px", display: "flex", flexDirection: "column", gap: 20 },

  /* Order header strip */
  orderHeader: { background: "#fff", borderRadius: 20, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  orderIdLabel: { fontSize: 12, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 },
  orderIdValue: { fontSize: 13, fontFamily: "monospace", color: "#111827", fontWeight: 700, margin: "4px 0 2px", wordBreak: "break-all" },
  orderDate: { fontSize: 13, color: "#6b7280", margin: 0 },
  badge: { padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" },

  /* Timeline */
  timeline: { background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  timelineSteps: { display: "flex", alignItems: "center" },
  stepCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 80 },
  stepCircle: { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" },
  stepLabel: { fontSize: 12, textAlign: "center", lineHeight: 1.3, maxWidth: 80 },
  connector: { flex: 1, height: 3, borderRadius: 2, marginBottom: 22 },
  cancelledBanner: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "12px 0" },

  /* Grid */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 },

  /* Card */
  card: { background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 18px" },

  /* Info rows */
  infoList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, fontSize: 14 },
  infoLabel: { color: "#6b7280", flexShrink: 0 },
  infoValue: { color: "#111827", fontWeight: 600, textAlign: "right" },

  /* Contact chips */
  contactRow: { display: "flex", gap: 10, flexWrap: "wrap", borderTop: "1px solid #f3f4f6", paddingTop: 14 },
  contactChip: { display: "flex", alignItems: "center", gap: 6, background: "#f5f3ff", padding: "6px 12px", borderRadius: 20, fontSize: 13, color: "#4b5563" },

  /* Total */
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #f3f4f6", paddingTop: 14, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: 700, color: "#111827" },
  totalValue: { fontSize: 18, fontWeight: 800, color: "#6366f1" },

  /* Items */
  itemsList: { display: "flex", flexDirection: "column", gap: 0 },
  itemRow: { display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #f3f4f6" },
  itemImg: { width: 60, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0, border: "1px solid #e5e7eb" },
  itemImgPlaceholder: { width: 60, height: 60, borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { display: "block", fontSize: 14, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  itemMeta: { display: "block", fontSize: 12, color: "#6b7280", marginTop: 3 },
  saleTag: { display: "inline-block", background: "#fee2e2", color: "#dc2626", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, marginTop: 4 },
  itemPrice: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 },
  itemPriceMain: { fontSize: 14, fontWeight: 700, color: "#111827" },
  itemPriceOld: { fontSize: 12, color: "#9ca3af", textDecoration: "line-through" },
};
