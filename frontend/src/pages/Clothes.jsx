import React, { useState } from "react";
import { Filter, Star, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Clothes = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const clothesProducts = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      category: "T-Shirts",
      price: 2999,
      originalPrice: 3999,
      rating: 4.5,
      reviewCount: 128,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White", "Black", "Gray"],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
    },
    {
      id: 2,
      name: "Denim Jacket",
      category: "Jackets",
      price: 8999,
      originalPrice: 11999,
      rating: 4.8,
      reviewCount: 256,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Blue", "Black"],
      sizes: ["M", "L", "XL"],
      isNew: false,
    },
    {
      id: 3,
      name: "Wool Sweater",
      category: "Sweaters",
      price: 6999,
      originalPrice: 8999,
      rating: 4.4,
      reviewCount: 187,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Gray", "Navy", "Burgundy"],
      sizes: ["S", "M", "L"],
      isNew: false,
    },
    {
      id: 4,
      name: "Cotton Polo Shirt",
      category: "Shirts",
      price: 4499,
      originalPrice: 5999,
      rating: 4.6,
      reviewCount: 94,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White", "Blue", "Green"],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
    },
    {
      id: 5,
      name: "Casual Blazer",
      category: "Blazers",
      price: 12999,
      originalPrice: 15999,
      rating: 4.7,
      reviewCount: 56,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Navy", "Gray", "Black"],
      sizes: ["M", "L", "XL"],
      isNew: false,
    },
    {
      id: 6,
      name: "Hooded Sweatshirt",
      category: "Hoodies",
      price: 5999,
      originalPrice: 7999,
      rating: 4.3,
      reviewCount: 203,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Gray", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
    },
    {
      id: 7,
      name: "Linen Shirt",
      category: "Shirts",
      price: 5499,
      originalPrice: 6999,
      rating: 4.5,
      reviewCount: 78,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["White", "Beige", "Blue"],
      sizes: ["S", "M", "L"],
      isNew: false,
    },
    {
      id: 8,
      name: "Winter Coat",
      category: "Coats",
      price: 18999,
      originalPrice: 24999,
      rating: 4.9,
      reviewCount: 45,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Camel", "Gray"],
      sizes: ["M", "L", "XL"],
      isNew: true,
    },
  ];

  const categories = [
    "T-Shirts",
    "Shirts",
    "Jackets",
    "Sweaters",
    "Hoodies",
    "Blazers",
    "Coats",
    "Pants",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    "White",
    "Black",
    "Gray",
    "Navy",
    "Blue",
    "Green",
    "Red",
    "Beige",
    "Brown",
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
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button className="text-sm text-gray-600 hover:text-gray-900">
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
                  {sizes.map((size) => (
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
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Filter Bar */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clothesProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
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
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                      {product.name}
                    </h3>

                    {/* Color and Size Options */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {product.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        {product.sizes.map((size, index) => (
                          <span key={index} className="text-xs text-gray-600">
                            {size}
                            {index < product.sizes.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>

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

            {/* Pagination */}
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

export default Clothes;
