import React, { useState, useEffect } from "react";
import axios from "axios";
import { Filter, Star, Heart, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // correct import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Clothes = () => {
  const [sortBy, setSortBy] = useState("featured");
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
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
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

  // Filter Clothes products within price range
  const clothesProducts = products
    .filter((p) => p.category === "Clothes")
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Clothes</h1>
          <p className="text-gray-300 text-lg">
            Discover our premium collection of clothing
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
                  onClick={() => setPriceRange([0, 50000])}
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
                  {clothesProducts.length} products
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {clothesProducts.map((product) => {
                const images = getProductImages(product);

                return (
                  <div
                    key={product._id || product.id}
                    className="group relative overflow-hidden bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Swiper Carousel */}
                    <div className="relative aspect-[3/4]">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                        className="w-full h-full"
                      >
                        {images.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <img
                              src={img}
                              alt={`${product.name} ${idx + 1}`}
                              className="w-full h-full object-cover rounded-t-xl"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop";
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                            NEW
                          </span>
                        )}
                        {product.onSale && product.salePrice && (
                          <span className="bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={() =>
                          toggleWishlist(product._id || product.id)
                        }
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:scale-110 transition-transform duration-300"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlist.includes(product._id || product.id)
                              ? "fill-rose-500 text-rose-500 scale-110"
                              : "text-gray-700 hover:text-rose-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-1 hover:text-gray-700 transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {product.description}
                      </span>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xl font-bold text-gray-900">
                          Rs.{" "}
                          {product.onSale && product.salePrice
                            ? product.salePrice.toLocaleString()
                            : product.price.toLocaleString()}
                        </span>
                        <button className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
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

export default Clothes;
