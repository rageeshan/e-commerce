import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart, ShoppingCart, Eye, SlidersHorizontal, Tag, Zap, HelpCircle,
} from "lucide-react";
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
    .pp-card:hover { box-shadow: 0 20px 48px rgba(0,0,0,.14)!important; transform: translateY(-5px)!important; }
    .pp-card:hover .pp-card-actions { opacity:1!important; transform:translateY(0)!important; }
    .pp-card:hover .pp-card-img { transform:scale(1.07)!important; }
    .pp-card-actions { opacity:0; transform:translateY(14px); transition:all .35s ease; }
    .pp-card-img { transition:transform .55s ease; }
    .pp-card { transition: box-shadow .3s ease, transform .3s ease; }
    .sale-cat-btn:hover { transform:scale(1.04); }
    .sale-cat-btn { transition:transform .2s; }
    .faq-card:hover { box-shadow:0 8px 24px rgba(0,0,0,.08)!important; }
    .faq-card { transition:box-shadow .2s; }
  `;
  document.head.appendChild(s);
}

const stockStyle = (s) => {
  if (s === "Available")     return { background:"#d1fae5", color:"#065f46" };
  if (s === "Out of Stock")  return { background:"#fee2e2", color:"#991b1b" };
  if (s === "Limited Stock") return { background:"#fef3c7", color:"#92400e" };
  return { background:"#fed7aa", color:"#9a3412" };
};

const Sale = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("discount");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getProductImages = (product) => {
    if (!product.image || product.image.length === 0)
      return ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"];
    return product.image.map(img => {
      if (!img || img.includes("…") || img.includes("...")) return null;
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      return `http://localhost:5001/uploads/${encodeURIComponent(img)}`;
    }).filter(Boolean);
  };

  const calcDiscount = (p) => {
    if (!p.onSale || !p.salePrice) return 0;
    return Math.round(((p.price - p.salePrice) / p.price) * 100);
  };

  const categories = ["Clothes", "Shoes", "Bags", "Accessories"];

  const saleProducts = products
    .filter(p => p.onSale === true)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .sort((a, b) => {
      if (sortBy === "discount") return calcDiscount(b) - calcDiscount(a);
      if (sortBy === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortBy === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
      return 0;
    });

  const maxDiscount = saleProducts.length > 0 ? Math.max(...saleProducts.map(calcDiscount)) : 0;

  const toggleWishlist = id => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleCat = cat => setSelectedCategories(p => p.includes(cat) ? p.filter(x => x !== cat) : [...p, cat]);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#fafafa" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:52,height:52,borderRadius:"50%",border:"4px solid #e5e7eb",borderTopColor:"#ef4444",animation:"spin 1s linear infinite",margin:"0 auto 14px" }} />
        <p style={{ color:"#6b7280",fontWeight:500 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#fafafa" }}>
      <Header />

      {/* ── Hero ── */}
      <div style={{
        position:"relative", overflow:"hidden",
        background:"linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #c2410c 100%)",
        padding:"72px 24px 80px",
      }}>
        {/* Decorative */}
        <div style={{ position:"absolute", top:-80, right:-60, width:400, height:400, background:"radial-gradient(circle,rgba(255,255,255,.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:300, height:300, background:"radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        {/* Animated pulse rings */}
        <div style={{ position:"absolute", top:"50%", right:80, transform:"translateY(-50%)", width:200, height:200, border:"2px solid rgba(255,255,255,.08)", borderRadius:"50%", animation:"pulse-ring 3s ease infinite", pointerEvents:"none" }} />
        <style>{`@keyframes pulse-ring{0%,100%{transform:translateY(-50%) scale(1);opacity:.5}50%{transform:translateY(-50%) scale(1.15);opacity:.2}}`}</style>

        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", color:"#fde68a", padding:"6px 16px", borderRadius:999, fontSize:12, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:20, backdropFilter:"blur(8px)" }}>
            <Tag style={{ width:13,height:13 }} /> Limited Time Offer
          </div>
          <h1 style={{ fontSize:"clamp(2.8rem,6vw,4.5rem)", fontWeight:900, color:"#fff", letterSpacing:"-.03em", lineHeight:1.05, marginBottom:16 }}>
            Mega Sale 🔥
          </h1>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:17, maxWidth:520, lineHeight:1.7, marginBottom:28 }}>
            Don't miss out on these incredible deals. Shop exceptional styles at unbeatable prices before they're gone.
          </p>
          {maxDiscount > 0 && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.15)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,.2)", padding:"14px 24px", borderRadius:16 }}>
              <Zap style={{ width:20,height:20,color:"#fde68a" }} />
              <span style={{ color:"rgba(255,255,255,.9)", fontSize:15, fontWeight:600 }}>
                Up to <span style={{ color:"#fde68a", fontWeight:900, fontSize:22 }}>{maxDiscount}% OFF</span> today
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"40px 24px 80px", display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:260, flexShrink:0, position:"sticky", top:84 }}>
          <div style={{ background:"#fff", borderRadius:20, border:"1px solid #f0f0f0", padding:24, boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, paddingBottom:16, borderBottom:"1px solid #f5f5f5" }}>
              <h2 style={{ fontWeight:700, fontSize:15, color:"#111", display:"flex", alignItems:"center", gap:8 }}>
                <SlidersHorizontal style={{ width:16,height:16,color:"#ef4444" }} /> Filters
              </h2>
              <button onClick={() => { setSelectedCategories([]); setPriceRange([0,100000]); }}
                style={{ fontSize:12, color:"#9ca3af", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Clear</button>
            </div>

            {/* Price */}
            <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>Price Range</p>
            <input type="range" min={0} max={100000} value={priceRange[1]}
              onChange={e => setPriceRange([0, +e.target.value])}
              style={{ width:"100%", accentColor:"#ef4444", marginBottom:14 }} />
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {[["Min","Rs. 0"],["Max",`Rs. ${priceRange[1].toLocaleString()}`]].map(([label,val]) => (
                <div key={label} style={{ flex:1, background:"#f9fafb", border:"1px solid #f0f0f0", borderRadius:12, padding:"8px 10px", textAlign:"center" }}>
                  <span style={{ display:"block", fontSize:10, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", marginBottom:2 }}>{label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#111" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Categories */}
            <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>Categories</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {categories.map(cat => {
                const active = selectedCategories.includes(cat);
                return (
                  <button key={cat} className="sale-cat-btn" onClick={() => toggleCat(cat)}
                    style={{ padding:"7px 14px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer", border:`1.5px solid ${active?"#ef4444":"#e5e7eb"}`, background:active?"linear-gradient(135deg,#ef4444,#f97316)":"#f9fafb", color:active?"#fff":"#374151" }}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Products ── */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", border:"1px solid #f0f0f0", borderRadius:16, padding:"14px 20px", marginBottom:28, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
            <span style={{ fontSize:14, color:"#6b7280", fontWeight:500 }}>
              <strong style={{ color:"#111" }}>{saleProducts.length}</strong> sale products
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>Sort:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:600, color:"#111", cursor:"pointer", outline:"none" }}>
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {saleProducts.length > 0 ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
              {saleProducts.map(product => {
                const images = getProductImages(product);
                const isWishlisted = wishlist.includes(product._id);
                const discount = calcDiscount(product);
                return (
                  <div key={product._id} className="pp-card"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ background:"#fff", borderRadius:20, overflow:"hidden", cursor:"pointer", border:"1px solid #f0f0f0", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                    <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden", background:"#f8f8f8" }}>
                      <Swiper modules={[Navigation,Pagination]} navigation pagination={{clickable:true}} loop style={{height:"100%"}}>
                        {images.map((img,i) => (
                          <SwiperSlide key={i} style={{height:"100%"}}>
                            <img className="pp-card-img" src={img} alt={product.name}
                              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                              onError={e => { e.target.src="https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {/* Discount badge */}
                      {discount > 0 && (
                        <div style={{ position:"absolute",top:10,left:10,zIndex:10,display:"flex",alignItems:"center",gap:5,background:"linear-gradient(135deg,#ef4444,#f97316)",color:"#fff",fontSize:11,fontWeight:800,padding:"5px 11px",borderRadius:999,boxShadow:"0 2px 8px rgba(239,68,68,.4)" }}>
                          <Zap style={{width:12,height:12}} /> -{discount}% OFF
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); toggleWishlist(product._id); }}
                        style={{ position:"absolute",top:10,right:10,zIndex:10,background:"#fff",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.1)" }}>
                        <Heart style={{ width:16,height:16,fill:isWishlisted?"#f43f5e":"none",color:isWishlisted?"#f43f5e":"#9ca3af" }} />
                      </button>
                      <div className="pp-card-actions" style={{ position:"absolute",bottom:10,left:10,right:10,display:"flex",gap:8,zIndex:10 }}>
                        <button onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                          style={{ flex:1,background:"#fff",color:"#111",border:"none",borderRadius:10,padding:"9px 0",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,.1)" }}>
                          <Eye style={{width:14,height:14}} /> View
                        </button>
                        <button onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                          style={{ flex:1,background:"linear-gradient(135deg,#ef4444,#f97316)",color:"#fff",border:"none",borderRadius:10,padding:"9px 0",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer" }}>
                          <ShoppingCart style={{width:14,height:14}} /> Add
                        </button>
                      </div>
                    </div>
                    <div style={{ padding:"16px 18px 18px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <h3 style={{ fontWeight:700, fontSize:14, color:"#111", flex:1, marginRight:8, lineHeight:1.4 }}>{product.name}</h3>
                        <span style={{ fontSize:10,fontWeight:600,background:"#f3f4f6",color:"#6b7280",padding:"2px 8px",borderRadius:999,whiteSpace:"nowrap" }}>{product.category}</span>
                      </div>
                      <p style={{ fontSize:12,color:"#9ca3af",lineHeight:1.6,marginBottom:12,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",minHeight:36 }}>{product.description}</p>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <span style={{ fontSize:18,fontWeight:800,color:"#ef4444" }}>
                            Rs. {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
                          </span>
                          {product.salePrice && (
                            <span style={{ fontSize:12,color:"#9ca3af",textDecoration:"line-through",marginLeft:6 }}>Rs. {product.price.toLocaleString()}</span>
                          )}
                        </div>
                        <span style={{ fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:999,...stockStyle(product.stockStatus) }}>{product.stockStatus}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"80px 24px", background:"#fff", borderRadius:20, border:"1px solid #f0f0f0" }}>
              <Tag style={{ width:56,height:56,color:"#e5e7eb",margin:"0 auto 16px",display:"block" }} />
              <h3 style={{ fontWeight:700, fontSize:18, color:"#111", marginBottom:8 }}>No sale items found</h3>
              <p style={{ color:"#9ca3af", fontSize:14, marginBottom:20 }}>Try resetting your filters or check back later.</p>
              <button onClick={() => { setSelectedCategories([]); setPriceRange([0,100000]); }}
                style={{ background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", border:"none", borderRadius:999, padding:"11px 24px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Reset Filters
              </button>
            </div>
          )}

          {/* ── FAQ ── */}
          <div style={{ marginTop:72, paddingTop:48, borderTop:"1px solid #f0f0f0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
              <HelpCircle style={{ width:22,height:22,color:"#ef4444" }} />
              <h2 style={{ fontSize:22, fontWeight:800, color:"#111", letterSpacing:"-.02em" }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
              {[
                { q:"How long will the sale last?", a:"This mega sale is valid for a limited time only. Prices will return to normal after the promotion period concludes." },
                { q:"Are all items discounted?", a:"Yes! Every item displayed in this section is marked down from its original retail price." },
                { q:"Can I return sale items?", a:"Absolutely! All purchased sale items come with our standard 30-day return policy for peace of mind." },
                { q:"Is shipping free?", a:"Yes! Enjoy complimentary free shipping on all orders over Rs. 5000, even during sale events." },
              ].map(faq => (
                <div key={faq.q} className="faq-card"
                  style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:16, padding:"20px 24px", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <h4 style={{ fontWeight:700, color:"#111", fontSize:14, marginBottom:10 }}>{faq.q}</h4>
                  <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.7 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sale;
