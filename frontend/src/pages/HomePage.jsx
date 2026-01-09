import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentOfferSlide, setCurrentOfferSlide] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/products");
        // Sort by creation date (newest first) and take only 6
        const sortedProducts = res.data
          .sort((a, b) => {
            // Use createdAt timestamp if available, otherwise use _id
            const dateA = a.createdAt
              ? new Date(a.createdAt).getTime()
              : new Date(a._id).getTime();
            const dateB = b.createdAt
              ? new Date(b.createdAt).getTime()
              : new Date(b._id).getTime();
            return dateB - dateA; // Newest first
          })
          .slice(0, 6); // Take only 6 products
        setProducts(sortedProducts);
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
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      title: "Premium Clothing Collection",
      subtitle: "Elevate Your Style",
      image:
        "https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Shop Now",
    },
    {
      id: 2,
      title: "Premium Accessories",
      subtitle: "Style Yourself with Elegance",
      image:
        "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Explore Collection",
    },
    {
      id: 3,
      title: "Branded Shoes and Bags",
      subtitle: "Step Out in Style",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Discover More",
    },
  ];

  // Offers slider data
  const offers = [
    {
      id: 1,
      title: "Flash Sale",
      description: "Up to 50% off on selected items",
      code: "FLASH50",
      expiry: "Ends in 24 hours",
      bgColor: "bg-gradient-to-r from-red-500 to-orange-500",
    },
    {
      id: 2,
      title: "Free Shipping",
      description: "On all orders above Rs. 5000",
      code: "FREESHIP",
      expiry: "Limited time offer",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "New User Offer",
      description: "Get 20% off on your first purchase",
      code: "WELCOME20",
      expiry: "For new customers only",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
  ];

  // Next/Previous slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextOfferSlide = () => {
    setCurrentOfferSlide((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
  };

  const prevOfferSlide = () => {
    setCurrentOfferSlide((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  // Toggle wishlist
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

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent card click event
    console.log("Added to cart:", product._id);
    alert(`Added ${product.name} to cart!`);
  };

  // Handle Card Click
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-xl text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-white/90 mb-8">{slide.subtitle}</p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls - Light style */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Indicators - Light style */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">
                  On orders above Rs. 5000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  100% secure transactions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - MAX 6 CARDS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-2">Recently added items</p>
            </div>
          </div>

          {/* Grid with exactly 6 cards max */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => {
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
                                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
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

                      {/* New badge - Always show since these are recently added */}
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                        NEW
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold mb-2 text-lg group-hover:text-gray-800 transition-colors">
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
                            className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-800 transition-colors group/cart"
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
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Slider */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Special Offers
          </h2>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-64 overflow-hidden rounded-2xl">
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  className={`absolute inset-0 ${
                    offer.bgColor
                  } transition-opacity duration-700 ease-in-out rounded-2xl ${
                    index === currentOfferSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-white/90 mb-4 text-center">
                      {offer.description}
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 mb-4">
                      <p className="text-white font-mono font-bold">
                        Use Code: {offer.code}
                      </p>
                    </div>
                    <p className="text-white/70 text-sm">{offer.expiry}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Offer Carousel Controls */}
            <button
              onClick={prevOfferSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextOfferSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Offer Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOfferSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentOfferSlide
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for latest trends and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
