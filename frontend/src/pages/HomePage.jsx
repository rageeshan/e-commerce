import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Eye,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ─────────────────────────────────────────
   Inline styles (no extra CSS file needed)
───────────────────────────────────────── */
const styles = {
  "@keyframes fadeInUp": `
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0);    }
  `,
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("hp-anim")) {
  const s = document.createElement("style");
  s.id = "hp-anim";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @keyframes fadeInUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeInLeft{ from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse-slow { 0%,100%{opacity:.6} 50%{opacity:1} }
    @keyframes shimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    .hp-fadein-up  { animation: fadeInUp  0.7s ease both }
    .hp-fadein-lft { animation: fadeInLeft 0.7s ease both }
    .hp-d1 { animation-delay:.1s } .hp-d2 { animation-delay:.25s }
    .hp-d3 { animation-delay:.4s  } .hp-d4 { animation-delay:.55s }
    .hp-card:hover .hp-card-actions { opacity:1; transform:translateY(0); }
    .hp-card:hover .hp-card-img     { transform:scale(1.06); }
    .hp-card-actions { opacity:0; transform:translateY(12px); transition:all .35s ease; }
    .hp-card-img     { transition:transform .5s ease; }
    .hp-feature-icon { transition:transform .3s ease; }
    .hp-feature:hover .hp-feature-icon { transform:scale(1.15) rotate(-8deg); }
    .hp-hero-overlay {
      background: linear-gradient(to right,
        rgba(10,10,20,.72) 0%,
        rgba(10,10,20,.35) 55%,
        rgba(10,10,20,.08) 100%
      );
    }
    .hp-shimmer {
      background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
      background-size:200% 100%;
      animation:shimmer 1.4s infinite;
    }
    * { font-family: 'Inter', sans-serif; }
  `;
  document.head.appendChild(s);
}

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentOfferSlide, setCurrentOfferSlide] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroTimerRef = useRef(null);

  /* ── auto-advance hero ── */
  useEffect(() => {
    heroTimerRef.current = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(heroTimerRef.current);
  }, []);

  /* ── fetch products ── */
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
        );
        const sorted = res.data
          .sort((a, b) => {
            const dA = a.createdAt ? new Date(a.createdAt) : new Date(a._id);
            const dB = b.createdAt ? new Date(b.createdAt) : new Date(b._id);
            return dB - dA;
          })
          .slice(0, 6);
        setProducts(sorted);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getProductImages = (product) => {
    if (!product.image || product.image.length === 0)
      return [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ];
    return product.image
      .map((img) => {
        if (!img || img.includes("…") || img.includes("...")) return null;
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(img)}`;
      })
      .filter(Boolean);
  };

  /* ── data ── */
  const heroSlides = [
    {
      id: 1,
      eyebrow: "New Season 2026",
      title: "Premium Clothing\nCollection",
      subtitle:
        "Elevate your everyday with curated styles crafted for the modern wardrobe.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&h=900&q=90",
      cta: "Shop Now",
      href: "/clothes",
    },
    {
      id: 2,
      eyebrow: "Accessory Edit",
      title: "Style Yourself\nwith Elegance",
      subtitle:
        "Discover handpicked accessories that complete every look effortlessly.",
      image:
        "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1600&h=900&q=90",
      cta: "Explore Collection",
      href: "/accessories",
    },
    {
      id: 3,
      eyebrow: "Footwear & Bags",
      title: "Step Out\nin Pure Style",
      subtitle: "Branded shoes and bags that make a statement wherever you go.",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&h=900&q=90",
      cta: "Discover More",
      href: "/shoes",
    },
  ];

  const offers = [
    {
      id: 1,
      icon: "⚡",
      title: "Flash Sale",
      description: "Up to 50% off on selected items",
      code: "FLASH50",
      expiry: "Ends in 24 hours",
      grad: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
    },
    {
      id: 2,
      icon: "🚚",
      title: "Free Shipping",
      description: "On all orders above Rs. 5000",
      code: "FREESHIP",
      expiry: "Limited time offer",
      grad: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
    },
    {
      id: 3,
      icon: "🎁",
      title: "New User Offer",
      description: "Get 20% off on your first purchase",
      code: "WELCOME20",
      expiry: "For new customers only",
      grad: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
  ];

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      sub: "On orders above Rs. 5000",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payment",
      sub: "100% secure transactions",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Easy Returns",
      sub: "30-day return policy",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Premium Quality",
      sub: "Curated brands only",
    },
  ];

  const nextSlide = () => {
    clearInterval(heroTimerRef.current);
    setCurrentSlide((p) => (p === heroSlides.length - 1 ? 0 : p + 1));
  };
  const prevSlide = () => {
    clearInterval(heroTimerRef.current);
    setCurrentSlide((p) => (p === 0 ? heroSlides.length - 1 : p - 1));
  };
  const nextOffer = () =>
    setCurrentOfferSlide((p) => (p === offers.length - 1 ? 0 : p + 1));
  const prevOffer = () =>
    setCurrentOfferSlide((p) => (p === 0 ? offers.length - 1 : p - 1));

  const toggleWishlist = (id) =>
    setWishlist((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const handleView = (id, e) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };
  const handleCart = (p, e) => {
    e.stopPropagation();
    navigate(`/product/${p._id}`);
  };

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "4px solid #e5e7eb",
              borderTopColor: "#111827",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500 }}>
            Loading StyleHub…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ───────── JSX ───────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Header />

      {/* ════════════ HERO ════════════ */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{ position: "relative", height: "clamp(480px,80vh,700px)" }}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: idx === currentSlide ? 1 : 0,
                transition: "opacity .8s ease",
              }}
            >
              {/* Dark gradient overlay */}
              <div
                className="hp-hero-overlay"
                style={{ position: "absolute", inset: 0 }}
              />

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 clamp(24px,6vw,96px)",
                }}
              >
                {idx === currentSlide && (
                  <div style={{ maxWidth: 580 }}>
                    {/* Eyebrow */}
                    <div
                      className="hp-fadein-up hp-d1"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(255,255,255,.12)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,.2)",
                        padding: "6px 16px",
                        borderRadius: 999,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: ".04em",
                        marginBottom: 20,
                      }}
                    >
                      <Sparkles style={{ width: 14, height: 14 }} />
                      {slide.eyebrow}
                    </div>

                    {/* Title */}
                    <h1
                      className="hp-fadein-up hp-d2"
                      style={{
                        fontSize: "clamp(2rem,5.5vw,3.75rem)",
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1.12,
                        marginBottom: 20,
                        whiteSpace: "pre-line",
                        letterSpacing: "-.02em",
                      }}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className="hp-fadein-up hp-d3"
                      style={{
                        fontSize: "clamp(14px,1.6vw,17px)",
                        color: "rgba(255,255,255,.82)",
                        marginBottom: 36,
                        lineHeight: 1.7,
                        maxWidth: 440,
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTA */}
                    <div
                      className="hp-fadein-up hp-d4"
                      style={{ display: "flex", gap: 14 }}
                    >
                      <button
                        onClick={() => navigate(slide.href)}
                        style={{
                          background: "#fff",
                          color: "#111",
                          padding: "14px 32px",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: 15,
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "transform .2s,box-shadow .2s",
                          boxShadow: "0 4px 20px rgba(0,0,0,.25)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 28px rgba(0,0,0,.35)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "";
                          e.currentTarget.style.boxShadow =
                            "0 4px 20px rgba(0,0,0,.25)";
                        }}
                      >
                        {slide.cta}{" "}
                        <ArrowRight style={{ width: 16, height: 16 }} />
                      </button>
                      <button
                        onClick={() => navigate("/sale")}
                        style={{
                          background: "rgba(255,255,255,.12)",
                          color: "#fff",
                          padding: "14px 28px",
                          borderRadius: 999,
                          fontWeight: 600,
                          fontSize: 15,
                          border: "1px solid rgba(255,255,255,.3)",
                          backdropFilter: "blur(8px)",
                          cursor: "pointer",
                          transition: "background .2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,.22)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,.12)";
                        }}
                      >
                        View Sale
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Controls */}
          {[
            { fn: prevSlide, side: "left", icon: <ChevronLeft /> },
            { fn: nextSlide, side: "right", icon: <ChevronRight /> },
          ].map(({ fn, side, icon }) => (
            <button
              key={side}
              onClick={fn}
              style={{
                position: "absolute",
                [side]: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(255,255,255,.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.25)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.15)";
              }}
            >
              {React.cloneElement(icon, { style: { width: 22, height: 22 } })}
            </button>
          ))}

          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
              zIndex: 10,
            }}
          >
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  height: 6,
                  width: i === currentSlide ? 32 : 8,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background:
                    i === currentSlide ? "#fff" : "rgba(255,255,255,.4)",
                  transition: "all .4s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES BAR ════════════ */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #f1f1f1" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 0,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="hp-feature"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "28px 24px",
                  borderRight:
                    i < features.length - 1 ? "1px solid #f1f1f1" : "none",
                  cursor: "default",
                }}
              >
                <div
                  className="hp-feature-icon"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg,#111827 0%,#374151 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(0,0,0,.18)",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#111",
                      marginBottom: 2,
                    }}
                  >
                    {f.title}
                  </p>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURED PRODUCTS ════════════ */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Heading */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: ".1em",
                  color: "#6366f1",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ✦ Just Arrived
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 800,
                  color: "#111",
                  letterSpacing: "-.02em",
                }}
              >
                Featured Products
              </h2>
              <p style={{ color: "#6b7280", marginTop: 6, fontSize: 15 }}>
                Handpicked, freshly added to the store
              </p>
            </div>
            <button
              onClick={() => navigate("/clothes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#111",
                color: "#fff",
                padding: "11px 22px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#374151";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#111";
              }}
            >
              View All <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {products.length > 0 ? (
              products.map((product) => {
                const images = getProductImages(product);
                const isWishlisted = wishlist.includes(product._id);

                return (
                  <div
                    key={product._id}
                    className="hp-card"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                      transition: "box-shadow .3s ease, transform .3s ease",
                      border: "1px solid #f0f0f0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(0,0,0,.12)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 12px rgba(0,0,0,.06)";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        overflow: "hidden",
                        background: "#f8f8f8",
                      }}
                    >
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                        style={{ height: "100%" }}
                      >
                        {images.map((img, idx) => (
                          <SwiperSlide key={idx} style={{ height: "100%" }}>
                            <img
                              className="hp-card-img"
                              src={img}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {/* Badges */}
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          zIndex: 10,
                        }}
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg,#10b981,#34d399)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 999,
                            letterSpacing: ".06em",
                            boxShadow: "0 2px 8px rgba(16,185,129,.4)",
                          }}
                        >
                          NEW
                        </span>
                        {product.onSale && (
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg,#ef4444,#f97316)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: 999,
                              letterSpacing: ".06em",
                              boxShadow: "0 2px 8px rgba(239,68,68,.4)",
                            }}
                          >
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 10,
                          background: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 38,
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 10px rgba(0,0,0,.12)",
                          transition: "transform .2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        <Heart
                          style={{
                            width: 18,
                            height: 18,
                            fill: isWishlisted ? "#f43f5e" : "none",
                            color: isWishlisted ? "#f43f5e" : "#9ca3af",
                            transition: "all .2s",
                          }}
                        />
                      </button>

                      {/* Hover action buttons */}
                      <div
                        className="hp-card-actions"
                        style={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          right: 12,
                          display: "flex",
                          gap: 8,
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={(e) => handleView(product._id, e)}
                          style={{
                            flex: 1,
                            background: "#fff",
                            color: "#111",
                            border: "none",
                            borderRadius: 10,
                            padding: "10px 0",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: "pointer",
                            boxShadow: "0 2px 12px rgba(0,0,0,.12)",
                          }}
                        >
                          <Eye style={{ width: 15, height: 15 }} /> View
                        </button>
                        <button
                          onClick={(e) => handleCart(product, e)}
                          style={{
                            flex: 1,
                            background: "#111",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "10px 0",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: "pointer",
                            boxShadow: "0 2px 12px rgba(0,0,0,.22)",
                          }}
                        >
                          <ShoppingCart style={{ width: 15, height: 15 }} /> Add
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "18px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 6,
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#111",
                            lineHeight: 1.4,
                            flex: 1,
                            marginRight: 8,
                          }}
                        >
                          {product.name}
                        </h3>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            background: "#f3f4f6",
                            color: "#6b7280",
                            padding: "3px 9px",
                            borderRadius: 999,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.category}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 13,
                          color: "#9ca3af",
                          lineHeight: 1.6,
                          marginBottom: 14,
                          minHeight: 40,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 20,
                              fontWeight: 800,
                              color: "#111",
                            }}
                          >
                            Rs.{" "}
                            {product.onSale && product.salePrice
                              ? product.salePrice.toLocaleString()
                              : product.price.toLocaleString()}
                          </span>
                          {product.onSale && product.salePrice && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "#9ca3af",
                                textDecoration: "line-through",
                                marginLeft: 8,
                              }}
                            >
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 999,
                            ...(product.stockStatus === "Available"
                              ? { background: "#d1fae5", color: "#065f46" }
                              : product.stockStatus === "Out of Stock"
                                ? { background: "#fee2e2", color: "#991b1b" }
                                : product.stockStatus === "Limited Stock"
                                  ? { background: "#fef3c7", color: "#92400e" }
                                  : {
                                      background: "#fed7aa",
                                      color: "#9a3412",
                                    }),
                          }}
                        >
                          {product.stockStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "64px 24px",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: 16 }}>
                  No products available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════ CATEGORY BANNERS ════════════ */}
      <section style={{ padding: "0 24px 80px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                label: "Clothes",
                href: "/clothes",
                img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&h=400&q=80",
                accent: "#6366f1",
              },
              {
                label: "Shoes",
                href: "/shoes",
                img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&h=400&q=80",
                accent: "#f43f5e",
              },
              {
                label: "Bags",
                href: "/bags",
                img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&h=400&q=80",
                accent: "#f59e0b",
              },
            ].map((cat) => (
              <div
                key={cat.label}
                onClick={() => navigate(cat.href)}
                style={{
                  position: "relative",
                  height: 220,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundImage: `url(${cat.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,.1)",
                  transition: "transform .3s, box-shadow .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.1) 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 22,
                      letterSpacing: "-.01em",
                    }}
                  >
                    {cat.label}
                  </span>
                  <div
                    style={{
                      background: cat.accent,
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 10px ${cat.accent}66`,
                    }}
                  >
                    <ArrowRight
                      style={{ width: 16, height: 16, color: "#fff" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ SPECIAL OFFERS ════════════ */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            background:
              "radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(244,63,94,.14) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              style={{
                color: "#818cf8",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              ✦ Limited Time
            </p>
            <h2
              style={{
                fontSize: "clamp(1.6rem,3vw,2.4rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-.02em",
              }}
            >
              Special Offers
            </h2>
          </div>

          {/* Offer card */}
          <div style={{ position: "relative" }}>
            {offers.map((offer, idx) => (
              <div
                key={offer.id}
                style={{
                  position: idx === 0 ? "relative" : "absolute",
                  inset: 0,
                  opacity: idx === currentOfferSlide ? 1 : 0,
                  transition: "opacity .6s ease",
                  pointerEvents: idx === currentOfferSlide ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    background: offer.grad,
                    borderRadius: 24,
                    padding: "48px 40px",
                    textAlign: "center",
                    boxShadow: "0 20px 60px rgba(0,0,0,.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Gloss */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "10%",
                      right: "10%",
                      height: "50%",
                      background:
                        "linear-gradient(to bottom,rgba(255,255,255,.12),transparent)",
                      borderRadius: "0 0 50% 50%",
                      pointerEvents: "none",
                    }}
                  />

                  <div style={{ fontSize: 48, marginBottom: 12 }}>
                    {offer.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 10,
                      letterSpacing: "-.02em",
                    }}
                  >
                    {offer.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,.9)",
                      fontSize: 17,
                      marginBottom: 28,
                    }}
                  >
                    {offer.description}
                  </p>

                  {/* Promo code */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      background: "rgba(255,255,255,.15)",
                      backdropFilter: "blur(10px)",
                      border: "1.5px dashed rgba(255,255,255,.5)",
                      borderRadius: 14,
                      padding: "14px 28px",
                      marginBottom: 20,
                    }}
                  >
                    <Tag style={{ width: 18, height: 18, color: "#fff" }} />
                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        fontSize: 18,
                        letterSpacing: ".12em",
                      }}
                    >
                      {offer.code}
                    </span>
                  </div>

                  <p style={{ color: "rgba(255,255,255,.65)", fontSize: 13 }}>
                    {offer.expiry}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            <button
              onClick={prevOffer}
              style={{
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.1)";
              }}
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              {offers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentOfferSlide(i)}
                  style={{
                    height: 6,
                    width: i === currentOfferSlide ? 28 : 8,
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background:
                      i === currentOfferSlide
                        ? "#fff"
                        : "rgba(255,255,255,.35)",
                    transition: "all .4s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextOffer}
              style={{
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.1)";
              }}
            >
              <ChevronRight style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════ NEWSLETTER ════════════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
              color: "#7c3aed",
              padding: "6px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".04em",
              marginBottom: 20,
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            Stay in the Loop
          </div>

          <h2
            style={{
              fontSize: "clamp(1.6rem,3vw,2.4rem)",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-.02em",
              marginBottom: 12,
            }}
          >
            Get Exclusive Deals
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 36,
            }}
          >
            Subscribe to our newsletter and be the first to know about new
            arrivals, exclusive sales, and style inspiration.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              gap: 12,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address…"
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: 999,
                border: "1.5px solid #e5e7eb",
                fontSize: 15,
                outline: "none",
                transition: "border-color .2s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(99,102,241,.4)",
                transition: "transform .2s, box-shadow .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(99,102,241,.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(99,102,241,.4)";
              }}
            >
              Subscribe
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 12, color: "#9ca3af" }}>
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
