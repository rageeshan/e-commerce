import React, { useState } from "react";
import { Filter, Star, Heart, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Bags = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const bagsProducts = [
    {
      id: 1,
      name: "Leather Handbag",
      category: "Handbags",
      price: 14999,
      originalPrice: 19999,
      rating: 4.9,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black", "Tan"],
      material: "Leather",
      isNew: false,
    },
    {
      id: 2,
      name: "Backpack",
      category: "Backpacks",
      price: 7999,
      originalPrice: 9999,
      rating: 4.6,
      reviewCount: 167,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Navy", "Gray"],
      material: "Nylon",
      isNew: true,
    },
    {
      id: 3,
      name: "Tote Bag",
      category: "Totes",
      price: 4999,
      originalPrice: 6999,
      rating: 4.4,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Beige", "White", "Black"],
      material: "Canvas",
      isNew: false,
    },
    {
      id: 4,
      name: "Clutch Bag",
      category: "Clutches",
      price: 3999,
      originalPrice: 5999,
      rating: 4.5,
      reviewCount: 78,
      image:
        "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Gold", "Silver", "Black"],
      material: "Satin",
      isNew: true,
    },
    {
      id: 5,
      name: "Messenger Bag",
      category: "Messenger",
      price: 8999,
      originalPrice: 11999,
      rating: 4.7,
      reviewCount: 112,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Brown", "Black"],
      material: "Leather",
      isNew: false,
    },
    {
      id: 6,
      name: "Weekender Bag",
      category: "Travel",
      price: 12999,
      originalPrice: 16999,
      rating: 4.8,
      reviewCount: 45,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Navy", "Olive", "Charcoal"],
      material: "Canvas",
      isNew: true,
    },
    {
      id: 7,
      name: "Crossbody Bag",
      category: "Crossbody",
      price: 6999,
      originalPrice: 8999,
      rating: 4.3,
      reviewCount: 189,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Red", "Black", "Brown"],
      material: "Leather",
      isNew: false,
    },
    {
      id: 8,
      name: "Laptop Bag",
      category: "Laptop",
      price: 5999,
      originalPrice: 7999,
      rating: 4.6,
      reviewCount: 156,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      colors: ["Black", "Gray", "Blue"],
      material: "Nylon",
      isNew: true,
    },
  ];

  const categories = [
    "Handbags",
    "Backpacks",
    "Totes",
    "Clutches",
    "Messenger",
    "Travel",
    "Crossbody",
    "Laptop",
  ];

  const colors = [
    "Black",
    "Brown",
    "Navy",
    "Gray",
    "Beige",
    "White",
    "Gold",
    "Silver",
    "Red",
    "Blue",
    "Olive",
    "Tan",
    "Charcoal",
  ];

  const materials = ["Leather", "Nylon", "Canvas", "Satin"];

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
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bags</h1>
          <p className="text-teal-300 text-lg">
            Carry your essentials in style with our collection
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
                    setSelectedMaterials([]);
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

              {/* Materials */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Materials</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMaterials([
                              ...selectedMaterials,
                              material,
                            ]);
                          } else {
                            setSelectedMaterials(
                              selectedMaterials.filter((m) => m !== material)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {material}
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
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  {bagsProducts.length} products
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
              {bagsProducts.map((product) => (
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

                    {/* Category Badge */}
                    <span className="absolute top-4 right-4 bg-gray-900/75 text-white text-xs px-2 py-1 rounded">
                      {product.category}
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

                    {/* Material Info */}
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded">
                        {product.material}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                      {product.name}
                    </h3>

                    {/* Color Options */}
                    <div className="flex items-center gap-2 mb-3">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
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

export default Bags;
