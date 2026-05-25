import React, { useState } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Loader2,
  Download,
  ArrowRight,
} from "lucide-react";
import { jsPDF } from "jspdf";
import Header from "../components/Header";
import Footer from "../components/Footer";

if (typeof document !== "undefined" && !document.getElementById("track-anim")) {
  const s = document.createElement("style");
  s.id = "track-anim";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
    @keyframes spin { to { transform:rotate(360deg) } }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .track-card-in { animation: fadeIn .5s ease both; }
    .track-dl-btn:hover { background:#e0e7ff!important; }
    .track-dl-btn { transition:background .2s; }
    .track-hero-input:focus-within { box-shadow:0 0 0 3px rgba(99,102,241,.25)!important; border-color:#6366f1!important; }
    .track-hero-input { transition:box-shadow .2s,border-color .2s; }
  `;
  document.head.appendChild(s);
}

const API_BASE = "http://localhost:5001/api";

const ORDER_STEPS = [
  { key: "confirmed",  label: "Order Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing",      icon: Package },
  { key: "shipped",    label: "Shipped",         icon: Truck },
];

const STATUS_COLORS = {
  confirmed:  { bg:"rgba(16,185,129,.08)", text:"#059669", border:"#a7f3d0" },
  processing: { bg:"rgba(99,102,241,.08)", text:"#6366f1", border:"#c7d2fe" },
  shipped:    { bg:"rgba(245,158,11,.08)", text:"#d97706", border:"#fde68a" },
  cancelled:  { bg:"rgba(239,68,68,.08)", text:"#dc2626", border:"#fca5a5" },
};

const PAYMENT_LABELS = {
  cod:       { label:"Cash on Delivery",  color:"#6366f1" },
  pending:   { label:"Payment Pending",   color:"#d97706" },
  verified:  { label:"Payment Verified",  color:"#059669" },
  cancelled: { label:"Payment Cancelled", color:"#dc2626" },
};

const SHIPPING_LABELS = { standard:"Standard Delivery", express:"Express Delivery" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString()}`;
}

/* ── Timeline ── */
function StatusTimeline({ status }) {
  const isCancelled = status === "cancelled";
  const currentIdx  = ORDER_STEPS.findIndex(s => s.key === status);
  return (
    <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:20, padding:"28px 32px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
      {isCancelled ? (
        <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center", padding:"16px 24px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:14, color:"#dc2626" }}>
          <XCircle style={{ width:20,height:20 }} />
          <span style={{ fontWeight:700, fontSize:13, textTransform:"uppercase", letterSpacing:".08em" }}>This order has been cancelled</span>
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
          {ORDER_STEPS.map((step, i) => {
            const done = i <= currentIdx;
            const Icon = step.icon;
            const isLast = i === ORDER_STEPS.length - 1;
            return (
              <React.Fragment key={step.key}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, flex:1 }}>
                  <div style={{
                    width:56, height:56, borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f3f4f6",
                    color: done ? "#fff" : "#9ca3af",
                    boxShadow: done ? "0 4px 16px rgba(99,102,241,.35)" : "none",
                    border: done ? "none" : "1.5px solid #e5e7eb",
                    transition: "all .4s ease",
                  }}>
                    <Icon style={{ width:20,height:20 }} />
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color: done ? "#111" : "#9ca3af", textAlign:"center" }}>
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div style={{
                    height:3, flex:"1 1 40px", borderRadius:99, maxWidth:80,
                    background: i < currentIdx ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#f3f4f6",
                    marginBottom:28, transition:"background .4s ease",
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Order Item ── */
function OrderItem({ item }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid #f9fafb" }}>
      {item.image ? (
        <img src={item.image} alt={item.name}
          style={{ width:60,height:60,objectFit:"cover",borderRadius:12,border:"1px solid #f0f0f0",flexShrink:0 }}
          onError={e => { e.target.src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }} />
      ) : (
        <div style={{ width:60,height:60,borderRadius:12,background:"#f9fafb",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <ShoppingBag style={{ width:22,height:22,color:"#9ca3af" }} />
        </div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ display:"block",fontSize:14,fontWeight:700,color:"#111",marginBottom:6 }}>{item.name}</span>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          {[`Size: ${item.size}`,`Qty: ${item.quantity}`].map(t => (
            <span key={t} style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"#6b7280",background:"#f3f4f6",padding:"2px 8px",borderRadius:999 }}>{t}</span>
          ))}
          {item.onSale && <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",color:"#ef4444",background:"#fef2f2",padding:"2px 8px",borderRadius:999 }}>SALE</span>}
        </div>
      </div>
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <span style={{ display:"block",fontSize:14,fontWeight:800,color:"#111" }}>{formatCurrency(item.price * item.quantity)}</span>
        {item.onSale && item.originalPrice && (
          <span style={{ fontSize:12,color:"#9ca3af",textDecoration:"line-through" }}>{formatCurrency(item.originalPrice * item.quantity)}</span>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,padding:"12px 0",borderBottom:"1px solid #f9fafb",fontSize:14 }}>
      <span style={{ color:"#6b7280",fontWeight:500 }}>{label}</span>
      <span style={{ color:"#111",fontWeight:600,textAlign:"right" }}>{value}</span>
    </div>
  );
}

/* ── Main Page ── */
export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order,   setOrder]   = useState(null);
  const [error,   setError]   = useState("");

  const downloadReceipt = (order) => {
    const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
    const primary = [99, 102, 241];
    const gray = [107, 114, 128];
    const border = [229, 231, 235];

    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, 210, 50, "F");

    doc.setFontSize(24); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
    doc.text("ORDER RECEIPT", 35, 32);
    doc.setFontSize(10); doc.setTextColor(199,210,254); doc.setFont("helvetica","normal");
    doc.text("Official Transaction Invoice", 35, 42);

    doc.setFillColor(255,255,255); doc.setDrawColor(primary[0],primary[1],primary[2]);
    doc.setLineWidth(0.5); doc.roundedRect(140, 15, 55, 20, 3, 3, "FD");
    doc.setFontSize(8); doc.setTextColor(gray[0],gray[1],gray[2]); doc.text("ORDER NUMBER", 145, 22);
    doc.setFontSize(12); doc.setTextColor(primary[0],primary[1],primary[2]); doc.setFont("helvetica","bold");
    doc.text(`#${order._id.slice(-8).toUpperCase()}`, 145, 32);

    doc.setFontSize(10); doc.setTextColor(gray[0],gray[1],gray[2]); doc.setFont("helvetica","normal");
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 70);
    doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString()}`, 20, 78);

    const sc = { confirmed:[59,130,246], processing:[245,158,11], shipped:[139,92,246], cancelled:[239,68,68] };
    const statusColor = sc[order.status] || gray;
    doc.setFillColor(statusColor[0],statusColor[1],statusColor[2]);
    doc.roundedRect(150, 60, 45, 15, 2, 2, "F");
    doc.setFontSize(9); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
    doc.text(order.status.toUpperCase(), 172.5, 70, { align:"center" });

    doc.setFillColor(255,255,255); doc.setDrawColor(border[0],border[1],border[2]);
    doc.roundedRect(20, 90, 170, 45, 4, 4, "FD");
    doc.setFontSize(11); doc.setTextColor(primary[0],primary[1],primary[2]); doc.setFont("helvetica","bold");
    doc.text("Customer Information", 25, 105);
    doc.setFontSize(9); doc.setTextColor(gray[0],gray[1],gray[2]); doc.setFont("helvetica","normal");
    doc.text(`${order.firstName} ${order.lastName}`, 25, 118);
    doc.text(order.email, 25, 128); doc.text(order.phone, 120, 118);

    doc.roundedRect(20, 145, 170, 35, 4, 4, "FD");
    doc.setFontSize(11); doc.setTextColor(primary[0],primary[1],primary[2]); doc.setFont("helvetica","bold");
    doc.text("Shipping Address", 25, 160);
    doc.setFontSize(9); doc.setTextColor(gray[0],gray[1],gray[2]); doc.setFont("helvetica","normal");
    doc.text(`${order.address}${order.apartment?`, ${order.apartment}`:""}`, 25, 173);
    doc.text(`${order.city}${order.postalCode?` ${order.postalCode}`:""}`, 25, 183);

    doc.setFillColor(primary[0],primary[1],primary[2]); doc.rect(20, 195, 170, 8, "F");
    doc.setFontSize(9); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
    ["Item","Size","Qty","Price","Total"].forEach((h,i) => {
      const x = [25,95,120,145,190][i];
      doc.text(h, x, 201, i===4?{align:"right"}:{});
    });

    let yPos = 208;
    doc.setFontSize(9); doc.setTextColor(gray[0],gray[1],gray[2]); doc.setFont("helvetica","normal");
    order.items?.forEach(item => {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      const name = item.name.length > 35 ? item.name.slice(0,32)+"..." : item.name;
      doc.text(name, 25, yPos); doc.text(item.size, 95, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`Rs ${item.price.toLocaleString()}`, 145, yPos);
      doc.text(`Rs ${(item.price*item.quantity).toLocaleString()}`, 190, yPos, {align:"right"});
      yPos += 8;
    });

    yPos += 5;
    doc.setDrawColor(border[0],border[1],border[2]); doc.line(20, yPos, 190, yPos); yPos += 8;
    doc.setFontSize(10); doc.setTextColor(gray[0],gray[1],gray[2]);
    doc.text("Subtotal:", 130, yPos); doc.text(`Rs ${order.subtotal?.toLocaleString()}`, 190, yPos, {align:"right"}); yPos += 7;
    doc.text(`Shipping (${order.shippingMethod}):`, 130, yPos); doc.text(`Rs ${order.shippingCost?.toLocaleString()}`, 190, yPos, {align:"right"}); yPos += 7;
    doc.setDrawColor(primary[0],primary[1],primary[2]); doc.line(20, yPos, 190, yPos); yPos += 8;
    doc.setFontSize(12); doc.setTextColor(primary[0],primary[1],primary[2]); doc.setFont("helvetica","bold");
    doc.text("Total Amount:", 130, yPos); doc.text(`Rs ${order.totalAmount?.toLocaleString()}`, 190, yPos, {align:"right"});

    yPos += 15;
    doc.setFillColor(240,253,244); doc.roundedRect(20, yPos, 170, 25, 4, 4, "FD");
    doc.setFontSize(9); doc.setTextColor(22,163,74); doc.setFont("helvetica","bold");
    doc.text("Payment Information", 25, yPos+8);
    doc.setFontSize(8); doc.setTextColor(gray[0],gray[1],gray[2]); doc.setFont("helvetica","normal");
    doc.text(`Method: ${order.paymentMethod?.replace("_"," ").toUpperCase()}`, 25, yPos+18);
    doc.text(`Status: ${order.paymentStatus?.toUpperCase()}`, 120, yPos+18);

    const footerY = 275;
    doc.setDrawColor(border[0],border[1],border[2]); doc.line(20, footerY, 190, footerY);
    doc.setFontSize(8); doc.setTextColor(156,163,175); doc.setFont("helvetica","normal");
    doc.text("Thank you for shopping with StyleHub!", 105, footerY+6, {align:"center"});
    doc.text("This is a computer-generated receipt. No signature required.", 105, footerY+12, {align:"center"});

    doc.save(`receipt-${order._id.slice(-8).toUpperCase()}.pdf`);
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    const id = orderId.trim().replace(/^#/, "");
    if (!id) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res  = await fetch(`${API_BASE}/orders/${id}`);
      const data = await res.json();
      if (!res.ok) setError(data.message || "Order not found. Please check your Order ID.");
      else setOrder(data);
    } catch {
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = order ? (STATUS_COLORS[order.status] || STATUS_COLORS.confirmed) : null;
  const paymentInfo  = order ? (PAYMENT_LABELS[order.paymentStatus] || { label:order.paymentStatus, color:"#6366f1" }) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#fafafa", display:"flex", flexDirection:"column" }}>
      <Header />

      <main style={{ flex:1, paddingBottom:80 }}>
        {/* ── Hero ── */}
        <div style={{
          position:"relative", overflow:"hidden",
          background:"linear-gradient(135deg, #0f0f1f 0%, #1e1b4b 50%, #0c0a20 100%)",
          padding:"80px 24px", textAlign:"center",
        }}>
          <div style={{ position:"absolute", top:0, left:"25%", width:400, height:400, background:"radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:0, right:"25%", width:360, height:360, background:"radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

          <div style={{ maxWidth:680, margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,.15)", border:"1px solid rgba(99,102,241,.3)", color:"#a5b4fc", padding:"6px 16px", borderRadius:999, fontSize:12, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:24, backdropFilter:"blur(8px)" }}>
              <Truck style={{ width:13,height:13 }} /> Real-time Tracking
            </div>
            <h1 style={{ fontSize:"clamp(2.2rem,5vw,3.4rem)", fontWeight:900, color:"#fff", letterSpacing:"-.03em", marginBottom:16, lineHeight:1.1 }}>
              Track Your Order
            </h1>
            <p style={{ color:"rgba(255,255,255,.65)", fontSize:17, lineHeight:1.7, marginBottom:36 }}>
              Enter your unique Order ID to instantly review delivery milestones, status updates, and items summary.
            </p>

            {/* Search form */}
            <form onSubmit={handleTrack} style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:540, margin:"0 auto" }}>
              <div className="track-hero-input"
                style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,.95)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(255,255,255,.3)", borderRadius:16, padding:"14px 18px", boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
                <Search style={{ width:18,height:18,color:"#9ca3af",flexShrink:0 }} />
                <input
                  id="order-id-input"
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="Paste Order ID here (e.g. 64b8a...)"
                  autoFocus
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:15, color:"#111", fontWeight:500 }}
                />
              </div>
              <button
                id="track-order-btn"
                type="submit"
                disabled={loading || !orderId.trim()}
                style={{
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff",
                  border:"none", borderRadius:14, padding:"15px 28px",
                  fontWeight:700, fontSize:15, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow:"0 4px 20px rgba(99,102,241,.45)",
                  opacity: loading || !orderId.trim() ? .6 : 1,
                  transition:"opacity .2s,transform .2s",
                }}
                onMouseEnter={e => { if (!loading && orderId.trim()) e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; }}
              >
                {loading ? <Loader2 style={{width:18,height:18,animation:"spin 1s linear infinite"}} /> : <ArrowRight style={{width:18,height:18}} />}
                {loading ? "Searching…" : "Track Order"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ maxWidth:860, margin:"28px auto 0", padding:"0 24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:14, padding:"14px 18px", color:"#dc2626", maxWidth:580, margin:"0 auto" }}>
              <AlertCircle style={{ width:18,height:18,flexShrink:0 }} />
              <span style={{ fontSize:14, fontWeight:600 }}>{error}</span>
            </div>
          </div>
        )}

        {/* ── Order Details ── */}
        {order && (
          <div className="track-card-in" style={{ maxWidth:860, margin:"40px auto 0", padding:"0 24px", display:"flex", flexDirection:"column", gap:20 }}>

            {/* Header card */}
            <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:20, padding:"24px 28px", boxShadow:"0 2px 12px rgba(0,0,0,.05)", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
              <div>
                <span style={{ fontSize:11, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:4 }}>Order ID</span>
                <span style={{ fontSize:15, fontWeight:800, color:"#111", fontFamily:"monospace", display:"block", wordBreak:"break-all" }}>{order._id}</span>
                <span style={{ fontSize:12, color:"#9ca3af", display:"block", marginTop:6 }}>Placed on {formatDate(order.createdAt)}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",padding:"6px 14px",borderRadius:999,border:`1px solid ${statusColors.border}`,background:statusColors.bg,color:statusColors.text }}>
                  {order.status}
                </span>
                <span style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",padding:"6px 14px",borderRadius:999,border:`1px solid ${paymentInfo.color}30`,background:`${paymentInfo.color}0d`,color:paymentInfo.color }}>
                  {paymentInfo.label}
                </span>
                <button className="track-dl-btn"
                  onClick={() => downloadReceipt(order)}
                  style={{ display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",padding:"6px 14px",borderRadius:999,border:"1px solid #c7d2fe",background:"#eef2ff",color:"#4338ca",cursor:"pointer" }}>
                  <Download style={{ width:12,height:12 }} /> Receipt
                </button>
              </div>
            </div>

            {/* Timeline */}
            <StatusTimeline status={order.status} />

            {/* 2-col grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
              {/* Delivery */}
              <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:20, padding:"24px 28px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                <h3 style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:800,color:"#111",textTransform:"uppercase",letterSpacing:".1em",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f5f5f5" }}>
                  <MapPin style={{ width:15,height:15,color:"#6366f1" }} /> Delivery Details
                </h3>
                <Row label="Customer Name" value={`${order.firstName} ${order.lastName}`} />
                <Row label="Address" value={[order.address, order.apartment, order.city, order.postalCode].filter(Boolean).join(", ")} />
                <Row label="Shipping Method" value={SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:16, paddingTop:16, borderTop:"1px solid #f5f5f5" }}>
                  {[
                    { icon:<Mail style={{width:13,height:13,color:"#6366f1"}}/>, val:order.email },
                    { icon:<Phone style={{width:13,height:13,color:"#6366f1"}}/>, val:order.phone },
                  ].map(({icon,val}) => (
                    <div key={val} style={{ display:"flex",alignItems:"center",gap:6,background:"#f9fafb",border:"1px solid #f0f0f0",borderRadius:10,padding:"7px 12px",fontSize:12,color:"#374151",fontWeight:600 }}>
                      {icon} {val}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:20, padding:"24px 28px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                <h3 style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:800,color:"#111",textTransform:"uppercase",letterSpacing:".1em",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f5f5f5" }}>
                  <CreditCard style={{ width:15,height:15,color:"#6366f1" }} /> Payment Summary
                </h3>
                <Row label="Payment Method" value={order.paymentMethod==="cod"?"Cash on Delivery":order.paymentMethod==="card"?"Card (Stripe)":"Bank Transfer"} />
                <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
                <Row label="Shipping" value={formatCurrency(order.shippingCost)} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, paddingTop:16, borderTop:"1px solid #f5f5f5" }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>Total Amount</span>
                  <span style={{ fontWeight:900, fontSize:20, color:"#6366f1" }}>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:20, padding:"24px 28px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
              <h3 style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:800,color:"#111",textTransform:"uppercase",letterSpacing:".1em",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f5f5f5" }}>
                <ShoppingBag style={{ width:15,height:15,color:"#6366f1" }} /> Order Items ({order.items?.length || 0})
              </h3>
              {order.items?.map((item,i) => <OrderItem key={i} item={item} />)}
            </div>

            {/* Notes */}
            {order.notes && (
              <div style={{ background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:20, padding:"24px 28px" }}>
                <h3 style={{ fontSize:12,fontWeight:800,color:"#4338ca",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10 }}>📝 Order Notes</h3>
                <p style={{ color:"#374151",fontSize:13,lineHeight:1.7 }}>{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
