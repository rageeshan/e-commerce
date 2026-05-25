import nodemailer from "nodemailer";

/* ─── Lazy transporter — only created when first email is sent ─── */
let _transporter = null;

const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
};

/* ─── Currency Formatter ─── */
const formatCurrency = (amount) =>
  `LKR ${Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

/* ─── Payment Method Label ─── */
const paymentLabel = (method) => {
  if (method === "cod") return "Cash on Delivery";
  if (method === "bank_transfer") return "Bank Transfer";
  if (method === "card") return "Credit / Debit Card (Stripe)";
  return method;
};

/* ─── Shipping Method Label ─── */
const shippingLabel = (method) => {
  if (method === "standard") return "Standard Delivery (3–5 business days)";
  if (method === "express") return "Express Delivery (1–2 business days)";
  return method;
};

/* ─── Base HTML Email Template ─── */
const buildEmailTemplate = (title, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f0f0f0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a2e;
    }
    .wrapper {
      max-width: 620px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    }
    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 40px 36px 32px;
      text-align: center;
    }
    .header .logo {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header .logo span {
      color: #e94560;
    }
    .header .tagline {
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    /* ── Status Banner ── */
    .status-banner {
      padding: 20px 36px;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      padding: 10px 28px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .badge-confirmed { background: #e8f5e9; color: #2e7d32; }
    .badge-shipped   { background: #e3f2fd; color: #1565c0; }
    /* ── Content Body ── */
    .content {
      padding: 32px 36px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .sub-text {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    /* ── Order Info Grid ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
    }
    .info-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 16px;
    }
    .info-card .label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 6px;
    }
    .info-card .value {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    /* ── Section Header ── */
    .section-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }
    /* ── Order Items Table ── */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .items-table th {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #999;
      padding: 8px 0;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .items-table th:last-child { text-align: right; }
    .items-table td {
      padding: 14px 0;
      border-bottom: 1px solid #f8f8f8;
      vertical-align: middle;
    }
    .item-img {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: 8px;
      background: #f0f0f0;
    }
    .item-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .item-meta {
      font-size: 12px;
      color: #888;
      margin-top: 3px;
    }
    .item-price {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
      text-align: right;
    }
    /* ── Totals ── */
    .totals-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 14px;
      color: #555;
    }
    .total-row.grand {
      padding-top: 14px;
      margin-top: 8px;
      border-top: 2px solid #e0e0e0;
      font-size: 17px;
      font-weight: 800;
      color: #1a1a2e;
    }
    /* ── Delivery Address ── */
    .address-box {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 18px 20px;
      margin-bottom: 28px;
    }
    .address-box .addr-name {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 4px;
    }
    .address-box .addr-line {
      font-size: 13px;
      color: #555;
      line-height: 1.7;
    }
    /* ── Shipped Message ── */
    .shipped-hero {
      background: linear-gradient(135deg, #1565c0, #0d47a1);
      border-radius: 14px;
      padding: 28px 24px;
      text-align: center;
      margin-bottom: 28px;
      color: white;
    }
    .shipped-hero .icon { font-size: 40px; margin-bottom: 10px; }
    .shipped-hero h2 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .shipped-hero p { font-size: 14px; opacity: 0.85; line-height: 1.6; }
    /* ── Footer ── */
    .footer {
      background: #1a1a2e;
      padding: 28px 36px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
    }
    .footer .footer-brand {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #fff;
      margin-bottom: 8px;
    }
    .footer .footer-brand span { color: #e94560; }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e94560, transparent);
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    ${bodyHtml}
  </div>
</body>
</html>
`;

/* ─── Build Items Rows HTML ─── */
const buildItemsRows = (items) =>
  items
    .map(
      (item) => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #f8f8f8; width: 64px;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" class="item-img" />`
            : `<div style="width:52px;height:52px;background:#eee;border-radius:8px;"></div>`
        }
      </td>
      <td style="padding: 14px 12px; border-bottom: 1px solid #f8f8f8;">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">Size: ${item.size} &nbsp;·&nbsp; Qty: ${item.quantity}</div>
        ${item.onSale ? `<div class="item-meta" style="color:#e94560;">Sale price applied</div>` : ""}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #f8f8f8; text-align:right; white-space:nowrap;">
        <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
        ${item.quantity > 1 ? `<div style="font-size:11px;color:#aaa;">${formatCurrency(item.price)} each</div>` : ""}
      </td>
    </tr>`
    )
    .join("");

/* ═══════════════════════════════════════════════════════════════
   ORDER CONFIRMATION EMAIL
   ═══════════════════════════════════════════════════════════════ */
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = getTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "StyleHub Store";
    const fromEmail = process.env.EMAIL_USER;

    const orderId = order._id.toString().toUpperCase().slice(-8);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-LK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const bodyHtml = `
      <!-- Header -->
      <div class="header">
        <div class="logo">Style<span>Hub</span></div>
        <div class="tagline">Fashion &amp; Lifestyle</div>
      </div>

      <!-- Status Banner -->
      <div class="status-banner" style="background:#f8fff8; padding:20px 36px;">
        <span class="status-badge badge-confirmed">✓ &nbsp;Order Confirmed</span>
      </div>

      <!-- Body -->
      <div class="content">
        <div class="greeting">Hi ${order.firstName}! 👋</div>
        <p class="sub-text">
          Thank you for your order! We've received it and are getting it ready for you.
          Here's your complete order receipt for reference.
        </p>

        <!-- Order Meta Grid -->
        <div class="info-grid">
          <div class="info-card">
            <div class="label">Order ID</div>
            <div class="value">#${orderId}</div>
          </div>
          <div class="info-card">
            <div class="label">Order Date</div>
            <div class="value">${orderDate}</div>
          </div>
          <div class="info-card">
            <div class="label">Payment Method</div>
            <div class="value">${paymentLabel(order.paymentMethod)}</div>
          </div>
          <div class="info-card">
            <div class="label">Shipping</div>
            <div class="value">${order.shippingMethod === "express" ? "⚡ Express" : "📦 Standard"}</div>
          </div>
        </div>

        <!-- Items -->
        <div class="section-title">Order Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:64px;"></th>
              <th>Product</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${buildItemsRows(order.items)}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="section-title">Order Summary</div>
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal (${order.items.length} item${order.items.length !== 1 ? "s" : ""})</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Shipping &mdash; ${order.shippingMethod === "express" ? "Express" : "Standard"}</span>
            <span>${formatCurrency(order.shippingCost)}</span>
          </div>
          <div class="total-row grand">
            <span>Total</span>
            <span>${formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="section-title">Delivery Address</div>
        <div class="address-box">
          <div class="addr-name">${order.firstName} ${order.lastName}</div>
          <div class="addr-line">
            ${order.address}${order.apartment ? `, ${order.apartment}` : ""}<br/>
            ${order.city}${order.postalCode ? ` ${order.postalCode}` : ""}<br/>
            📞 ${order.phone}
          </div>
        </div>

        ${
          order.notes
            ? `<div class="section-title">Order Notes</div>
               <div class="address-box" style="margin-bottom:0;">
                 <div class="addr-line">${order.notes}</div>
               </div>`
            : ""
        }

        ${
          order.paymentMethod === "bank_transfer"
            ? `<div style="background:#fff8e1;border-left:4px solid #f9a825;border-radius:8px;padding:16px 20px;margin-top:20px;">
                <strong style="color:#e65100;">⚠️ Bank Transfer Reminder</strong><br/>
                <span style="font-size:13px;color:#555;line-height:1.6;display:block;margin-top:6px;">
                  Please upload your payment receipt in your order page to complete verification. 
                  Your order will be processed once payment is confirmed.
                </span>
               </div>`
            : ""
        }
      </div>

      <!-- Footer -->
      <div class="divider" style="margin:0;height:1px;background:linear-gradient(to right,transparent,#e94560,transparent);"></div>
      <div class="footer">
        <div class="footer-brand">Style<span>Hub</span></div>
        <p>
          If you have any questions, reply to this email or contact our support.<br/>
          Thank you for shopping with us!
        </p>
        <p style="margin-top:12px;">© ${new Date().getFullYear()} StyleHub. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: order.email,
      subject: `✅ Order Confirmed — #${orderId} | StyleHub`,
      html: buildEmailTemplate(`Order Confirmed — #${orderId}`, bodyHtml),
    });

    console.log(`✉️  Order confirmation email sent to ${order.email}`);
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error.message);
    // Don't throw — email failure should NOT break the order flow
  }
};

/* ═══════════════════════════════════════════════════════════════
   ORDER SHIPPED EMAIL
   ═══════════════════════════════════════════════════════════════ */
export const sendOrderShippedEmail = async (order) => {
  try {
    const transporter = getTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "StyleHub Store";
    const fromEmail = process.env.EMAIL_USER;

    const orderId = order._id.toString().toUpperCase().slice(-8);

    const bodyHtml = `
      <!-- Header -->
      <div class="header">
        <div class="logo">Style<span>Hub</span></div>
        <div class="tagline">Fashion &amp; Lifestyle</div>
      </div>

      <!-- Status Banner -->
      <div class="status-banner" style="background:#e3f2fd; padding:20px 36px;">
        <span class="status-badge badge-shipped">🚚 &nbsp;Your Order Is On Its Way!</span>
      </div>

      <!-- Body -->
      <div class="content">
        <div class="greeting">Great news, ${order.firstName}! 🎉</div>
        <p class="sub-text">
          Your order has been shipped and is on its way to you. 
          Sit tight — your StyleHub package will arrive soon!
        </p>

        <!-- Shipped Hero -->
        <div class="shipped-hero">
          <div class="icon">🚚</div>
          <h2>Your Order Is Shipped!</h2>
          <p>
            Order <strong>#${orderId}</strong> has left our warehouse.<br/>
            Expected delivery: <strong>${order.shippingMethod === "express" ? "1–2 business days" : "3–5 business days"}</strong>
          </p>
        </div>

        <!-- Delivery Address -->
        <div class="section-title">Delivering To</div>
        <div class="address-box">
          <div class="addr-name">${order.firstName} ${order.lastName}</div>
          <div class="addr-line">
            ${order.address}${order.apartment ? `, ${order.apartment}` : ""}<br/>
            ${order.city}${order.postalCode ? ` ${order.postalCode}` : ""}<br/>
            📞 ${order.phone}
          </div>
        </div>

        <!-- Items Summary -->
        <div class="section-title">Items In This Shipment</div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:64px;"></th>
              <th>Product</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${buildItemsRows(order.items)}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span>${formatCurrency(order.shippingCost)}</span>
          </div>
          <div class="total-row grand">
            <span>Total Paid</span>
            <span>${formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <!-- Shipping Method -->
        <div style="background:#f0f4ff;border-radius:10px;padding:16px 20px;text-align:center;">
          <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#999;margin-bottom:6px;">Shipping Method</div>
          <div style="font-size:15px;font-weight:600;color:#1a1a2e;">${shippingLabel(order.shippingMethod)}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="divider" style="margin:0;height:1px;background:linear-gradient(to right,transparent,#e94560,transparent);"></div>
      <div class="footer">
        <div class="footer-brand">Style<span>Hub</span></div>
        <p>
          If you have any questions about your delivery, reply to this email.<br/>
          We hope you love your new items!
        </p>
        <p style="margin-top:12px;">© ${new Date().getFullYear()} StyleHub. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: order.email,
      subject: `🚚 Your Order Is On Its Way! — #${orderId} | StyleHub`,
      html: buildEmailTemplate(`Order Shipped — #${orderId}`, bodyHtml),
    });

    console.log(`✉️  Shipping notification email sent to ${order.email}`);
  } catch (error) {
    console.error("❌ Failed to send shipping email:", error.message);
    // Don't throw — email failure should NOT break the status update flow
  }
};

/* ═══════════════════════════════════════════════════════════════
   ORDER CANCELLED EMAIL
   ═══════════════════════════════════════════════════════════════ */
export const sendOrderCancelledEmail = async (order) => {
  try {
    const transporter = getTransporter();
    const fromName  = process.env.EMAIL_FROM_NAME || "StyleHub Store";
    const fromEmail = process.env.EMAIL_USER;
    const supportEmail = process.env.EMAIL_USER; // replies go to same address

    const orderId = order._id.toString().toUpperCase().slice(-8);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-LK", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const bodyHtml = `
      <!-- Header -->
      <div class="header">
        <div class="logo">Style<span>Hub</span></div>
        <div class="tagline">Fashion &amp; Lifestyle</div>
      </div>

      <!-- Status Banner -->
      <div class="status-banner" style="background:#fff5f5; padding:20px 36px;">
        <span class="status-badge" style="background:#fee2e2;color:#b91c1c;letter-spacing:1.5px;">
          ✕ &nbsp;Order Cancelled
        </span>
      </div>

      <!-- Body -->
      <div class="content">
        <div class="greeting" style="color:#b91c1c;">Hi ${order.firstName}, we're sorry.</div>
        <p class="sub-text">
          Your order <strong>#${orderId}</strong> has been cancelled.
          We understand this may be disappointing, and we're here to help.
        </p>

        <!-- Order Meta -->
        <div class="info-grid">
          <div class="info-card">
            <div class="label">Order ID</div>
            <div class="value">#${orderId}</div>
          </div>
          <div class="info-card">
            <div class="label">Order Date</div>
            <div class="value">${orderDate}</div>
          </div>
          <div class="info-card">
            <div class="label">Payment Method</div>
            <div class="value">${paymentLabel(order.paymentMethod)}</div>
          </div>
          <div class="info-card">
            <div class="label">Order Total</div>
            <div class="value">${formatCurrency(order.totalAmount)}</div>
          </div>
        </div>

        <!-- Why was it cancelled -->
        <div class="section-title">Why Orders Get Cancelled</div>
        <div style="background:#fff5f5; border-radius:12px; padding:20px 24px; margin-bottom:24px;">
          <p style="font-size:13px;color:#555;margin-bottom:14px;line-height:1.7;">
            Orders may be cancelled for one or more of the following reasons:
          </p>
          <ul style="padding-left:20px;margin:0;display:flex;flex-direction:column;gap:10px;">
            <li style="font-size:13px;color:#374151;line-height:1.6;">
              <strong>Payment not verified</strong> — Bank transfer receipt was not uploaded or
              could not be confirmed within the required time.
            </li>
            <li style="font-size:13px;color:#374151;line-height:1.6;">
              <strong>Item out of stock</strong> — One or more items became unavailable after
              your order was placed.
            </li>
            <li style="font-size:13px;color:#374151;line-height:1.6;">
              <strong>Incomplete or incorrect details</strong> — Delivery address or contact
              information could not be verified.
            </li>
            <li style="font-size:13px;color:#374151;line-height:1.6;">
              <strong>Requested by customer</strong> — The cancellation was initiated at your
              request.
            </li>
            <li style="font-size:13px;color:#374151;line-height:1.6;">
              <strong>Suspicious activity</strong> — Our system flagged unusual activity on
              the order for security reasons.
            </li>
          </ul>
        </div>

        <!-- Refund notice -->
        ${order.paymentMethod !== "cod"
          ? `<div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
              <strong style="color:#92400e;">💳 Refund Information</strong>
              <p style="font-size:13px;color:#555;line-height:1.7;margin-top:8px;margin-bottom:0;">
                If a payment was made and verified, a refund will be processed within
                <strong>5–7 business days</strong> to your original payment method.
                If you have not received your refund after this period, please contact us.
              </p>
             </div>`
          : ""
        }

        <!-- Items in the cancelled order -->
        <div class="section-title">Cancelled Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:64px;"></th>
              <th>Product</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${buildItemsRows(order.items)}
          </tbody>
        </table>

        <!-- Contact Support -->
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:14px;padding:28px 24px;text-align:center;margin-top:4px;">
          <div style="font-size:24px;margin-bottom:10px;">💬</div>
          <h3 style="color:#fff;font-size:17px;font-weight:800;margin-bottom:8px;">
            Need Help? Contact Us
          </h3>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;line-height:1.7;margin-bottom:16px;">
            If you believe this cancellation was a mistake, or you'd like to place a new order,
            our support team is happy to help.
          </p>
          <a href="mailto:${supportEmail}"
             style="display:inline-block;background:linear-gradient(135deg,#e94560,#c0392b);
                    color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;
                    font-size:14px;font-weight:700;letter-spacing:0.5px;">
            ✉️ &nbsp;Email Support
          </a>
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:14px;margin-bottom:0;">
            ${supportEmail}<br/>We typically reply within 24 hours.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="divider" style="margin:0;height:1px;background:linear-gradient(to right,transparent,#e94560,transparent);"></div>
      <div class="footer">
        <div class="footer-brand">Style<span>Hub</span></div>
        <p>
          We hope to serve you again soon.<br/>
          Thank you for choosing StyleHub.
        </p>
        <p style="margin-top:12px;">© ${new Date().getFullYear()} StyleHub. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: order.email,
      subject: `❌ Order Cancelled — #${orderId} | StyleHub`,
      html: buildEmailTemplate(`Order Cancelled — #${orderId}`, bodyHtml),
    });

    console.log(`✉️  Cancellation email sent to ${order.email}`);
  } catch (error) {
    console.error("❌ Failed to send cancellation email:", error.message);
    // Don't throw — email failure should NOT break the cancellation flow
  }
};
