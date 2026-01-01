import React, { useState } from "react";
import { Filter, Star, Heart, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Accessories = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const accessoriesProducts = [
    {
      id: 1,
      name: "Silk Scarf",
      category: "Scarves",
      price: 2499,
      originalPrice: 3499,
      rating: 4.6,
      reviewCount: 56,
      image:
        "https://images.unsplash.com/photo-1551222672-6c9e63b9d7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Red", "Blue", "Green", "Yellow"],
      isNew: true,
    },
    {
      id: 2,
      name: "Leather Belt",
      category: "Belts",
      price: 3999,
      originalPrice: 4999,
      rating: 4.4,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black"],
      isNew: false,
    },
    {
      id: 3,
      name: "Designer Watch",
      category: "Watches",
      price: 24999,
      originalPrice: 34999,
      rating: 4.8,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Silver", "Gold", "Rose Gold"],
      isNew: true,
    },
    {
      id: 4,
      name: "Sunglasses",
      category: "Eyewear",
      price: 8999,
      originalPrice: 11999,
      rating: 4.5,
      reviewCount: 167,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Brown", "Tortoise"],
      isNew: false,
    },
    {
      id: 5,
      name: "Leather Wallet",
      category: "Wallets",
      price: 2999,
      originalPrice: 3999,
      rating: 4.3,
      reviewCount: 78,
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black"],
      isNew: true,
    },
    {
      id: 6,
      name: "Silver Necklace",
      category: "Jewelry",
      price: 6999,
      originalPrice: 8999,
      rating: 4.7,
      reviewCount: 45,
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Silver"],
      isNew: false,
    },
    {
      id: 7,
      name: "Knitted Beanie",
      category: "Hats",
      price: 1999,
      originalPrice: 2999,
      rating: 4.2,
      reviewCount: 112,
      image:
        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Gray", "Navy", "Black"],
      isNew: true,
    },
    {
      id: 8,
      name: "Cotton Bandana",
      category: "Bandanas",
      price: 999,
      originalPrice: 1499,
      rating: 4.1,
      reviewCount: 67,
      image:
        "https://images.unsplash.com/photo-1584910269615-e6e1b9dda5a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Red", "Blue", "Black", "White"],
      isNew: false,
    },
  ];

  const categories = [
    "Watches",
    "Jewelry",
    "Sunglasses",
    "Belts",
    "Wallets",
    "Scarves",
    "Hats",
    "Bandanas",
  ];

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Black",
    "White",
    "Brown",
    "Gray",
    "Navy",
    "Silver",
    "Gold",
    "Rose Gold",
    "Tortoise",
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
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessories</h1>
          <p className="text-purple-300 text-lg">
            Complete your look with our premium accessories
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
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  {accessoriesProducts.length} products
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
              {accessoriesProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
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

                    {/* Color Options */}
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {product.category}
                    </p>
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

export default Accessories;
