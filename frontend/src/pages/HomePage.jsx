import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentOfferSlide, setCurrentOfferSlide] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      title: "Summer Collection 2024",
      subtitle: "Fresh styles for the sunny days",
      image:
        "https://images.unsplash.com/photo-1693580847464-ffdd57670827?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Shop Now",
      // color: "bg-gradient-to-r from-blue-50 to-cyan-50",
    },
    {
      id: 2,
      title: "Premium Winter Wear",
      subtitle: "Stay warm in style",
      image:
        "https://plus.unsplash.com/premium_photo-1764091967752-88900d7d5ac6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Explore Collection",
      // color: "bg-gradient-to-r from-gray-50 to-slate-100",
    },
    {
      id: 3,
      title: "Casual Everyday Wear",
      subtitle: "Comfort meets fashion",
      image:
        "https://images.unsplash.com/photo-1737748612418-e39bcd6503a2?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Discover More",
      // color: "bg-gradient-to-r from-amber-50 to-orange-50",
    },
  ];

  // Product cards data
  const products = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      category: "Clothes",
      price: 2999,
      originalPrice: 3999,
      rating: 4.5,
      reviewCount: 128,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
    },
    {
      id: 2,
      name: "Denim Jacket",
      category: "Clothes",
      price: 8999,
      originalPrice: 11999,
      rating: 4.8,
      reviewCount: 256,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
    },
    {
      id: 3,
      name: "Running Shoes",
      category: "Shoes",
      price: 12999,
      originalPrice: 15999,
      rating: 4.7,
      reviewCount: 342,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
    },
    {
      id: 4,
      name: "Leather Handbag",
      category: "Bags",
      price: 14999,
      originalPrice: 19999,
      rating: 4.9,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
    },
    {
      id: 5,
      name: "Silk Scarf",
      category: "Accessories",
      price: 2499,
      originalPrice: 3499,
      rating: 4.6,
      reviewCount: 56,
      image:
        "https://images.unsplash.com/photo-1551222672-6c9e63b9d7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
    },
    {
      id: 6,
      name: "Wool Sweater",
      category: "Clothes",
      price: 6999,
      originalPrice: 8999,
      rating: 4.4,
      reviewCount: 187,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
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

  // Navigation items
  const navItems = [
    { name: "Clothes", href: "#" },
    { name: "Accessories", href: "#" },
    { name: "Shoes", href: "#" },
    { name: "Bags", href: "#" },
    { name: "Sale", href: "#" },
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">STYLEHUB</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="ml-2 bg-transparent outline-none text-sm w-48"
                />
              </div>

              {/* Search Icon for Mobile */}
              <button className="lg:hidden p-2">
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Cart */}
              <button className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Account */}
              <button className="p-2" onClick={() => navigate("/login")}>
                <User className="w-5 h-5 text-gray-700" />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              {/* Mobile Search */}
              <div className="mt-4 flex items-center bg-gray-50 rounded-lg px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="ml-2 bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </header>

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
              <div className={`absolute inset-0 ${slide.color}`}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>

              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">{slide.subtitle}</p>
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-gray-900 w-8"
                    : "bg-gray-400 hover:bg-gray-600"
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

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-2">
                Handpicked items just for you
              </p>
            </div>
            <button className="text-gray-900 font-medium hover:text-gray-700">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlist.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700"
                      }`}
                    />
                  </button>

                  {/* Quick View */}
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Quick View
                  </button>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button className="text-gray-900 hover:text-gray-700">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-900" />
                </div>
                <span className="text-2xl font-bold">STYLEHUB</span>
              </div>
              <p className="text-gray-400 mb-6">
                Premium clothing and accessories for the modern lifestyle.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Shop</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">
                    123 Fashion Street, Colombo
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">+94 11 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">info@stylehub.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} StyleHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
