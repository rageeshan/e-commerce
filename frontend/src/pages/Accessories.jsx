import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Filter, Heart, ShoppingCart, Eye } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Accessories = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------- Images Helper ---------------- */
  const getProductImages = (product) => {
    if (!product.image || product.image.length === 0) {
      return [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
      ];
    }

    return product.image
      .map((img) => {
        if (!img || img.includes("…") || img.includes("...")) return null;
        return `http://localhost:5001/uploads/${encodeURIComponent(img)}`;
      })
      .filter(Boolean);
  };

  /* ---------------- Filter and Sort Accessories ---------------- */
  const accessoriesProducts = useMemo(() => {
    // First filter by category and price range
    let filtered = products
      .filter((p) => p.category === "Accessories")
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Apply sorting based on sortBy state
    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceA - priceB;
        });

      case "price-high":
        return [...filtered].sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceB - priceA;
        });

      case "newest":
        // Assuming products have a createdAt field or similar
        // If not, you can sort by _id or keep original order
        return [...filtered].sort((a, b) => {
          // Sort by _id as a fallback (MongoDB ObjectIds have timestamp)
          return b._id.localeCompare(a._id);
        });

      default:
        return filtered;
    }
  }, [products, priceRange, sortBy]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle View button click
  const handleViewProduct = (productId, e) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/product/${productId}`);
  };

  // Handle Add to Cart — navigate to product page where size can be selected
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  // Handle Card Click
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessories</h1>
          <p className="text-purple-300 text-lg">
            Complete your look with premium accessories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <div className="flex justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button
                  className="text-sm text-gray-600"
                  onClick={() => {
                    setPriceRange([0, 1000000]);
                    setSortBy("newest"); // Reset sort to default
                  }}
                >
                  Clear All
                </button>
              </div>

              <h3 className="mb-3 font-medium">Price Range</h3>
              <input
                type="range"
                min="0"
                max="1000000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>Rs. {priceRange[0].toLocaleString()}</span>
                <span>Rs. {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:w-3/4">
            <div className="flex justify-between mb-8">
              <div className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                <span>{accessoriesProducts.length} products</span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-4 py-2 rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessoriesProducts.map((product) => {
                const images = getProductImages(product);

                return (
                  <div
                    key={product._id}
                    className="border rounded-xl overflow-hidden hover:shadow-xl transition group cursor-pointer"
                    onClick={() => handleCardClick(product._id)}
                  >
                    {/* Square image container */}
                    <div className="relative aspect-square bg-gray-50">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                        className="h-full"
                      >
                        {images.map((img, idx) => (
                          <SwiperSlide key={idx} className="h-full">
                            <img
                              src={img}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop";
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${wishlist.includes(product._id)
                              ? "fill-rose-500 text-rose-500"
                              : "text-gray-700 hover:text-rose-500"
                            }`}
                        />
                      </button>

                      {/* Sale badge */}
                      {product.onSale && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                          SALE
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold mb-2 text-lg group-hover:text-purple-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            Rs.{" "}
                            {product.onSale && product.salePrice
                              ? product.salePrice.toLocaleString()
                              : product.price.toLocaleString()}
                          </span>
                          {product.onSale && product.salePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={(e) => handleViewProduct(product._id, e)}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors group/view"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5 group-hover/view:scale-110 transition-transform" />
                          </button>

                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="bg-gray-900 text-white p-3 rounded-full hover:bg-purple-800 transition-colors group/cart"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* Stock status */}
                      <div className="mt-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${product.stockStatus === "Available"
                              ? "bg-green-100 text-green-800"
                              : product.stockStatus === "Out of Stock"
                                ? "bg-red-100 text-red-800"
                                : product.stockStatus === "Limited Stock"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                        >
                          {product.stockStatus}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Accessories;
