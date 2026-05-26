import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingCart, Eye, SlidersHorizontal } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

if (typeof document !== "undefined" && !document.getElementById("pp-anim")) {
  const s = document.createElement("style");
  s.id = "pp-anim";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
    .pp-card:hover { box-shadow: 0 20px 48px rgba(0,0,0,.13)!important; transform: translateY(-5px)!important; }
    .pp-card:hover .pp-card-actions { opacity:1!important; transform:translateY(0)!important; }
    .pp-card:hover .pp-card-img { transform:scale(1.07)!important; }
    .pp-card-actions { opacity:0; transform:translateY(14px); transition:all .35s ease; }
    .pp-card-img { transition:transform .55s ease; }
    .pp-card { transition: box-shadow .3s ease, transform .3s ease; }
  `;
  document.head.appendChild(s);
}

const stockStyle = (s) => {
  if (s === "Available") return { background: "#d1fae5", color: "#065f46" };
  if (s === "Out of Stock") return { background: "#fee2e2", color: "#991b1b" };
  if (s === "Limited Stock") return { background: "#fef3c7", color: "#92400e" };
  return { background: "#fed7aa", color: "#9a3412" };
};

const Accessories = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getProductImages = (product) => {
    if (!product.image || product.image.length === 0)
      return [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
      ];
    return product.image
      .map((img) => {
        if (!img || img.includes("…") || img.includes("...")) return null;
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return `http://localhost:5001/uploads/${encodeURIComponent(img)}`;
      })
      .filter(Boolean);
  };

  const sorted = useMemo(() => {
    let filtered = products
      .filter((p) => p.category === "Accessories")
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "price-low")
      return [...filtered].sort(
        (a, b) =>
          (a.onSale && a.salePrice ? a.salePrice : a.price) -
          (b.onSale && b.salePrice ? b.salePrice : b.price),
      );
    if (sortBy === "price-high")
      return [...filtered].sort(
        (a, b) =>
          (b.onSale && b.salePrice ? b.salePrice : b.price) -
          (a.onSale && a.salePrice ? a.salePrice : a.price),
      );
    return [...filtered].sort((a, b) => b._id.localeCompare(a._id));
  }, [products, priceRange, sortBy]);

  const toggleWishlist = (id) =>
    setWishlist((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "4px solid #e5e7eb",
              borderTopColor: "#111",
              animation: "spin 1s linear infinite",
              margin: "0 auto 14px",
            }}
          />
          <p style={{ color: "#6b7280", fontWeight: 500 }}>Loading…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Header />

      {/* ── Hero Banner ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1e0a3c 0%, #3b0764 50%, #1a0a2e 100%)",
          padding: "72px 24px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            background:
              "radial-gradient(circle,rgba(168,85,247,.22) 0%,transparent 70%)",
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
              "radial-gradient(circle,rgba(99,102,241,.16) 0%,transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(168,85,247,.15)",
              border: "1px solid rgba(168,85,247,.3)",
              color: "#d8b4fe",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            ✦ Refined Details
          </div>
          <h1
            style={{
              fontSize: "clamp(2.4rem,5vw,4rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-.03em",
              lineHeight: 1.08,
              marginBottom: 16,
            }}
          >
            Accessories
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.65)",
              fontSize: 17,
              maxWidth: 500,
              lineHeight: 1.7,
            }}
          >
            Complete your look with premium accessories — from statement pieces
            to everyday elegance.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          style={{ width: 260, flexShrink: 0, position: "sticky", top: 84 }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #f0f0f0",
              padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#111",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <SlidersHorizontal
                  style={{ width: 16, height: 16, color: "#a855f7" }}
                />{" "}
                Filters
              </h2>
              <button
                onClick={() => setPriceRange([0, 1000000])}
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Price Range
            </p>
            <input
              type="range"
              min={0}
              max={1000000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, +e.target.value])}
              style={{
                width: "100%",
                accentColor: "#a855f7",
                marginBottom: 14,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["Min", "Rs. 0"],
                ["Max", `Rs. ${priceRange[1].toLocaleString()}`],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                    padding: "8px 10px",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: "#9ca3af",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#111" }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Products ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              padding: "14px 20px",
              marginBottom: 28,
              boxShadow: "0 2px 8px rgba(0,0,0,.04)",
            }}
          >
            <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
              <strong style={{ color: "#111" }}>{sorted.length}</strong>{" "}
              products
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {sorted.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                gap: 20,
              }}
            >
              {sorted.map((product) => {
                const images = getProductImages(product);
                const isWishlisted = wishlist.includes(product._id);
                return (
                  <div
                    key={product._id}
                    className="pp-card"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        overflow: "hidden",
                        background: "#f8f8f8",
                      }}
                    >
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                        style={{ height: "100%" }}
                      >
                        {images.map((img, i) => (
                          <SwiperSlide key={i} style={{ height: "100%" }}>
                            <img
                              className="pp-card-img"
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
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop";
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                          zIndex: 10,
                        }}
                      >
                        {product.onSale && (
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg,#ef4444,#f97316)",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "3px 9px",
                              borderRadius: 999,
                            }}
                          >
                            SALE
                          </span>
                        )}
                        {product.isNew && !product.onSale && (
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg,#10b981,#34d399)",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "3px 9px",
                              borderRadius: 999,
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 10,
                          background: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,.1)",
                        }}
                      >
                        <Heart
                          style={{
                            width: 16,
                            height: 16,
                            fill: isWishlisted ? "#f43f5e" : "none",
                            color: isWishlisted ? "#f43f5e" : "#9ca3af",
                          }}
                        />
                      </button>
                      <div
                        className="pp-card-actions"
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          right: 10,
                          display: "flex",
                          gap: 8,
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`);
                          }}
                          style={{
                            flex: 1,
                            background: "#fff",
                            color: "#111",
                            border: "none",
                            borderRadius: 10,
                            padding: "9px 0",
                            fontWeight: 600,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            cursor: "pointer",
                            boxShadow: "0 2px 10px rgba(0,0,0,.1)",
                          }}
                        >
                          <Eye style={{ width: 14, height: 14 }} /> View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`);
                          }}
                          style={{
                            flex: 1,
                            background: "#111",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "9px 0",
                            fontWeight: 600,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            cursor: "pointer",
                          }}
                        >
                          <ShoppingCart style={{ width: 14, height: 14 }} /> Add
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: "16px 18px 18px" }}>
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
                            fontSize: 14,
                            color: "#111",
                            flex: 1,
                            marginRight: 8,
                            lineHeight: 1.4,
                          }}
                        >
                          {product.name}
                        </h3>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            background: "#f3f4f6",
                            color: "#6b7280",
                            padding: "2px 8px",
                            borderRadius: 999,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.category}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          lineHeight: 1.6,
                          marginBottom: 12,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: 36,
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
                              fontSize: 18,
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
                                fontSize: 12,
                                color: "#9ca3af",
                                textDecoration: "line-through",
                                marginLeft: 6,
                              }}
                            >
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 999,
                            ...stockStyle(product.stockStatus),
                          }}
                        >
                          {product.stockStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #f0f0f0",
              }}
            >
              <span
                style={{ fontSize: 48, display: "block", marginBottom: 16 }}
              >
                💍
              </span>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#111",
                  marginBottom: 8,
                }}
              >
                No accessories found
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                Try clearing or expanding your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Accessories;
