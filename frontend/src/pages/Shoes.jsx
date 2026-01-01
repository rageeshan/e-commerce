import React, { useState } from "react";
import { Filter, Star, Heart, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Shoes = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const shoesProducts = [
    {
      id: 1,
      name: "Running Shoes",
      type: "Sports",
      price: 12999,
      originalPrice: 15999,
      rating: 4.7,
      reviewCount: 342,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White/Red", "Black", "Gray"],
      sizes: [7, 8, 9, 10, 11, 12],
      isNew: true,
    },
    {
      id: 2,
      name: "Leather Loafers",
      type: "Casual",
      price: 8999,
      originalPrice: 11999,
      rating: 4.5,
      reviewCount: 189,
      image:
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black"],
      sizes: [7, 8, 9, 10, 11],
      isNew: false,
    },
    {
      id: 3,
      name: "Canvas Sneakers",
      type: "Casual",
      price: 5999,
      originalPrice: 7999,
      rating: 4.3,
      reviewCount: 267,
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White", "Black", "Navy"],
      sizes: [6, 7, 8, 9, 10, 11, 12],
      isNew: true,
    },
    {
      id: 4,
      name: "Formal Oxfords",
      type: "Formal",
      price: 14999,
      originalPrice: 19999,
      rating: 4.8,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Brown"],
      sizes: [8, 9, 10, 11],
      isNew: false,
    },
    {
      id: 5,
      name: "Hiking Boots",
      type: "Outdoor",
      price: 17999,
      originalPrice: 22999,
      rating: 4.6,
      reviewCount: 123,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black"],
      sizes: [8, 9, 10, 11, 12],
      isNew: true,
    },
    {
      id: 6,
      name: "Slip-on Sandals",
      type: "Casual",
      price: 3999,
      originalPrice: 4999,
      rating: 4.2,
      reviewCount: 178,
      image:
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black", "Navy"],
      sizes: [7, 8, 9, 10, 11],
      isNew: false,
    },
    {
      id: 7,
      name: "Basketball Shoes",
      type: "Sports",
      price: 13999,
      originalPrice: 17999,
      rating: 4.4,
      reviewCount: 95,
      image:
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White/Blue", "Black/Red"],
      sizes: [8, 9, 10, 11, 12, 13],
      isNew: true,
    },
    {
      id: 8,
      name: "Chelsea Boots",
      type: "Casual",
      price: 11999,
      originalPrice: 14999,
      rating: 4.7,
      reviewCount: 67,
      image:
        "https://images.unsplash.com/photo-1605812860427-4024433a70fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Brown", "Tan"],
      sizes: [8, 9, 10, 11],
      isNew: false,
    },
  ];

  const categories = ["Casual", "Sports", "Formal", "Outdoor"];
  const shoeSizes = [6, 7, 8, 9, 10, 11, 12, 13];
  const colors = [
    "White",
    "Black",
    "Gray",
    "Brown",
    "Navy",
    "Red",
    "Blue",
    "Tan",
    "White/Red",
    "White/Blue",
    "Black/Red",
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

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
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
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

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {shoeSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(
                            selectedSizes.filter((s) => s !== size)
                          );
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded border ${
                        selectedSizes.includes(size)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        if (selectedColors.includes(color)) {
                          setSelectedColors(
                            selectedColors.filter((c) => c !== color)
                          );
                        } else {
                          setSelectedColors([...selectedColors, color]);
                        }
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColors.includes(color)
                          ? "border-gray-900"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase().split("/")[0],
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  {shoesProducts.length} products
                </span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shoesProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] mb-4">
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
                      {product.originalPrice && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-1">
                          -
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <span className="absolute top-4 right-4 bg-gray-900/75 text-white text-xs px-2 py-1 rounded">
                      {product.type}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-14 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700"
                        }`}
                      />
                    </button>

                    {/* Size Options */}
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      <span className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded">
                        Sizes: {product.sizes.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
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

            {/* Pagination (Optional) */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-gray-900 text-white">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  10
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shoes;
