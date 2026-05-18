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

const Shoes = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
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

  // Convert image filenames to URLs
  const getProductImages = (product) => {
    if (!product.image || product.image.length === 0) {
      return [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ];
    }

    return product.image
      .map((img) => {
        // Skip invalid/truncated filenames
        if (!img || img.includes("…") || img.includes("...")) return null;
        return `http://localhost:5001/uploads/${encodeURIComponent(img)}`;
      })
      .filter(Boolean); // remove nulls
  };

  // Filter and sort Shoes products
  const shoesProducts = useMemo(() => {
    // First filter by category and price range
    let filtered = products
      .filter((p) => p.category === "Shoes")
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
        // Sort by _id (MongoDB ObjectIds contain timestamp)
        // If you have a createdAt field, use that instead:
        // return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return [...filtered].sort((a, b) => {
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
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shoes</h1>
          <p className="text-amber-300 text-lg">
            Step up your style with our premium footwear collection
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    setPriceRange([0, 50000]);
                    setSortBy("newest");
                  }}
                >
                  Clear All
                </button>
              </div>
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  {shoesProducts.length} products
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shoesProducts.map((product) => {
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
                                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
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
                          className={`w-5 h-5 transition-colors ${
                            wishlist.includes(product._id)
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
                      <h3 className="font-semibold mb-2 text-lg group-hover:text-amber-700 transition-colors">
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
                            className="bg-gray-900 text-white p-3 rounded-full hover:bg-amber-800 transition-colors group/cart"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* Stock status */}
                      <div className="mt-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            product.stockStatus === "Available"
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

export default Shoes;
