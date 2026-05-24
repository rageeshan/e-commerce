import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Filter,
  Heart,
  ShoppingCart,
  Tag,
  Clock,
  Zap,
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Sale = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("discount");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

  // Filter products where onSale is true
  const saleProducts = products
    .filter((p) => p.onSale === true)
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  // Calculate discount percentage
  const calculateDiscount = (product) => {
    if (!product.onSale || !product.salePrice) return 0;
    return Math.round(
      ((product.price - product.salePrice) / product.price) * 100
    );
  };

  const categories = ["Clothes", "Shoes", "Bags", "Accessories"];

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
        <p>Loading sale products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mr-4">
                <Tag className="w-8 h-8" />
              </div>
              <div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  Limited Time Offer
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              MEGA SALE
              <span className="block text-3xl md:text-4xl mt-2 font-normal">
                Up to{" "}
                {Math.max(...saleProducts.map((p) => calculateDiscount(p)), 0)}%
                OFF Everything
              </span>
            </h1>

            <p className="text-xl text-red-100 mb-8">
              Don't miss out on these incredible deals. Shop now before they're
              gone forever!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sale Filters
                </h2>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 1000000]);
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
                    max="100000"
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

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="discount">Highest Discount</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {saleProducts.length} of {saleProducts.length} sale
                items
              </div>
            </div>

            {/* Products Grid - Square Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleProducts
                .sort((a, b) => {
                  const discountA = calculateDiscount(a);
                  const discountB = calculateDiscount(b);

                  switch (sortBy) {
                    case "discount":
                      return discountB - discountA;
                    case "price-low":
                      return (
                        (a.salePrice || a.price) - (b.salePrice || b.price)
                      );
                    case "price-high":
                      return (
                        (b.salePrice || b.price) - (a.salePrice || a.price)
                      );
                    default:
                      return 0;
                  }
                })
                .map((product) => {
                  const images = getProductImages(product);
                  const discount = calculateDiscount(product);

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
                                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                                }}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                          -{discount}% OFF
                        </div>

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
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>

                        <h3 className="font-semibold mb-2 text-lg group-hover:text-red-600 transition-colors">
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
                              className="bg-gray-900 text-white p-3 rounded-full hover:bg-red-800 transition-colors group/cart"
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
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Empty State */}
            {saleProducts.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-12 max-w-2xl mx-auto">
                  <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Sale Items Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    There are no products on sale at the moment. Check back soon
                    for amazing deals!
                  </p>
                  <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
                    Browse All Products
                  </button>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Sale FAQs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How long will the sale last?
                  </h4>
                  <p className="text-gray-600">
                    This flash sale will end in 24 hours. All prices will return
                    to normal after the timer reaches zero.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Are all items discounted?
                  </h4>
                  <p className="text-gray-600">
                    Yes! Every item in our sale section is discounted from their
                    original prices.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Can I return sale items?
                  </h4>
                  <p className="text-gray-600">
                    Absolutely! All sale items come with our standard return
                    policy, no questions asked.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Is shipping free?
                  </h4>
                  <p className="text-gray-600">
                    Yes! Enjoy free shipping on all orders over Rs. 5000 during
                    the sale period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sale;
