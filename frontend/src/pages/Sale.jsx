import React, { useState, useEffect } from "react";
import {
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Tag,
  Clock,
  Flame,
  TrendingDown,
  Percent,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Sale = () => {
  const [sortBy, setSortBy] = useState("discount");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 59,
    seconds: 59,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saleProducts = [
    {
      id: 1,
      name: "Premium Denim Jacket",
      category: "Clothes",
      price: 7999,
      originalPrice: 14999,
      discount: 47,
      rating: 4.8,
      reviewCount: 189,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 85,
      total: 100,
    },
    {
      id: 2,
      name: "Designer Leather Handbag",
      category: "Bags",
      price: 12999,
      originalPrice: 24999,
      discount: 48,
      rating: 4.9,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 92,
      total: 100,
    },
    {
      id: 3,
      name: "Performance Running Shoes",
      category: "Shoes",
      price: 8999,
      originalPrice: 17999,
      discount: 50,
      rating: 4.7,
      reviewCount: 342,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 78,
      total: 100,
    },
    {
      id: 4,
      name: "Luxury Silk Scarf",
      category: "Accessories",
      price: 1999,
      originalPrice: 4999,
      discount: 60,
      rating: 4.6,
      reviewCount: 156,
      image:
        "https://images.unsplash.com/photo-1551222672-6c9e63b9d7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: false,
      sold: 45,
      total: 100,
    },
    {
      id: 5,
      name: "Casual Wool Sweater",
      category: "Clothes",
      price: 5499,
      originalPrice: 10999,
      discount: 50,
      rating: 4.4,
      reviewCount: 267,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: false,
      sold: 63,
      total: 100,
    },
    {
      id: 6,
      name: "Smart Watch Pro",
      category: "Accessories",
      price: 17999,
      originalPrice: 34999,
      discount: 49,
      rating: 4.8,
      reviewCount: 456,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 88,
      total: 100,
    },
    {
      id: 7,
      name: "Canvas Sneakers",
      category: "Shoes",
      price: 4999,
      originalPrice: 9999,
      discount: 50,
      rating: 4.3,
      reviewCount: 189,
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: false,
      sold: 52,
      total: 100,
    },
    {
      id: 8,
      name: "Leather Backpack",
      category: "Bags",
      price: 9999,
      originalPrice: 18999,
      discount: 47,
      rating: 4.6,
      reviewCount: 178,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 71,
      total: 100,
    },
    {
      id: 9,
      name: "Designer Sunglasses",
      category: "Accessories",
      price: 6999,
      originalPrice: 14999,
      discount: 53,
      rating: 4.5,
      reviewCount: 267,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: false,
      sold: 39,
      total: 100,
    },
    {
      id: 10,
      name: "Formal Blazer",
      category: "Clothes",
      price: 11999,
      originalPrice: 22999,
      discount: 48,
      rating: 4.7,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 81,
      total: 100,
    },
    {
      id: 11,
      name: "Leather Loafers",
      category: "Shoes",
      price: 7999,
      originalPrice: 15999,
      discount: 50,
      rating: 4.5,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: false,
      sold: 47,
      total: 100,
    },
    {
      id: 12,
      name: "Elegant Clutch Bag",
      category: "Bags",
      price: 3999,
      originalPrice: 8999,
      discount: 56,
      rating: 4.5,
      reviewCount: 123,
      image:
        "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isHot: true,
      sold: 68,
      total: 100,
    },
  ];

  const categories = ["Clothes", "Shoes", "Bags", "Accessories"];
  const discountRanges = [
    { min: 60, max: 70, label: "60% & Above" },
    { min: 50, max: 59, label: "50-59% Off" },
    { min: 40, max: 49, label: "40-49% Off" },
    { min: 30, max: 39, label: "30-39% Off" },
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getDiscountColor = (discount) => {
    if (discount >= 60) return "bg-red-600";
    if (discount >= 50) return "bg-orange-500";
    return "bg-amber-500";
  };

  //   const getDiscountRange = (discount) => {
  //     if (discount >= 60) return "60% & Above";
  //     if (discount >= 50) return "50-59% Off";
  //     if (discount >= 40) return "40-49% Off";
  //     return "30-39% Off";
  //   };

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
                Up to 70% OFF Everything
              </span>
            </h1>

            <p className="text-xl text-red-100 mb-8">
              Don't miss out on these incredible deals. Shop now before they're
              gone forever!
            </p>

            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-medium">Flash Sale Ends In:</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-white/20 rounded-lg py-2 px-4">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm mt-1">Hours</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-white/20 rounded-lg py-2 px-4">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm mt-1">Minutes</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-white/20 rounded-lg py-2 px-4">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm mt-1">Seconds</div>
                </div>
              </div>
            </div>
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
                    setSelectedDiscounts([]);
                    setPriceRange([0, 50000]);
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

              {/* Discount Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Discount</h3>
                <div className="space-y-2">
                  {discountRanges.map((range) => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDiscounts.includes(range.label)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDiscounts([
                              ...selectedDiscounts,
                              range.label,
                            ]);
                          } else {
                            setSelectedDiscounts(
                              selectedDiscounts.filter((d) => d !== range.label)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hot Deals Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Deal Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <Flame className="w-4 h-4 mr-1 text-orange-500" />
                      Hot Deals Only
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                      Ending Soon
                    </span>
                  </label>
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
                  <option value="popular">Most Popular</option>
                  <option value="ending">Ending Soon</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {saleProducts.length} of {saleProducts.length} items
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts
                .sort((a, b) => {
                  switch (sortBy) {
                    case "discount":
                      return b.discount - a.discount;
                    case "price-low":
                      return a.price - b.price;
                    case "price-high":
                      return b.price - a.price;
                    case "popular":
                      return b.sold - a.sold;
                    default:
                      return 0;
                  }
                })
                .map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={`${getDiscountColor(
                          product.discount
                        )} text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg`}
                      >
                        -{product.discount}% OFF
                      </div>
                    </div>

                    {/* Hot Deal Badge */}
                    {product.isHot && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center">
                          <Flame className="w-3 h-3 mr-1.5" />
                          Hot Deal
                        </div>
                      </div>
                    )}

                    {/* Stock Progress */}
                    <div className="absolute top-14 left-4 right-4 z-10">
                      <div className="text-xs text-white font-medium mb-1">
                        Almost gone!
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full"
                          style={{
                            width: `${(product.sold / product.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-white mt-1">
                        <span>{product.sold} sold</span>
                        <span>{product.total - product.sold} left</span>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-[4/5]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <button className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-20 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            wishlist.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-700"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 cursor-pointer transition-colors">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          Save Rs.{" "}
                          {(
                            product.originalPrice - product.price
                          ).toLocaleString()}
                        </div>
                      </div>

                      {/* Add to Cart */}
                      <button className="w-full mt-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2.5 rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-300 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white overflow-hidden relative">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 mr-3 text-yellow-400" />
                  <h2 className="text-2xl font-bold">Flash Sale Alert!</h2>
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                  These prices won't last! Our biggest sale of the year is
                  ending soon. Don't miss your chance to grab premium items at
                  unbelievable prices.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
                    Shop All Deals
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
                    View Hot Deals
                  </button>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-500/20 to-transparent"></div>
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-9xl font-bold text-white/10">
                SALE
              </div>
            </div>

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
                    Yes! Every item in our sale section is discounted by up to
                    70% off their original prices.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Can I return sale items?
                  </h4>
                  <p className="text-gray-600">
                    Absolutely! All sale items come with our standard 30-day
                    return policy, no questions asked.
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
