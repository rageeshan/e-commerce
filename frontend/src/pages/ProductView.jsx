import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Share2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);

        const allProductsRes = await axios.get(
          "http://localhost:5001/api/products?limit=100"
        );
        const allProducts = Array.isArray(allProductsRes.data)
          ? allProductsRes.data
          : (allProductsRes.data.products || []);
        const similar = allProducts
          .filter(
            (p) => p.category === res.data.category && p._id !== res.data._id
          )
          .slice(0, 4);
        setSimilarProducts(similar);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Convert image filenames to URLs
  const getProductImages = (product) => {
    if (!product?.image || product.image.length === 0) {
      return [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ];
    }

    return product.image
      .map((img) => {
        if (!img || img.includes("…") || img.includes("...")) return null;
        return `http://localhost:5001/uploads/${encodeURIComponent(img)}`;
      })
      .filter(Boolean);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const increaseQuantity = () => {
    const maxQty = selectedSize
      ? product.sizeAvailability?.[selectedSize]?.quantity ?? 99
      : 99;
    setQuantity((prev) => Math.min(prev + 1, maxQty));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Reset quantity when size changes
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    const added = addToCart(product, selectedSize, quantity);
    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = getProductImages(product);
  const isOutOfStock = product.stockStatus === "Out of Stock";
  const discount =
    product.onSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image Carousel */}
            <div className="border rounded-xl overflow-hidden">
              <Swiper
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
                className="h-[500px]"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  className="h-24"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-pointer">
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">Over Rs. 5000</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">100% Secure</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30 Days Return</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                {product.onSale && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    -{discount}% OFF
                  </span>
                )}
                {product.stockStatus === "New" && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    NEW
                  </span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rs.{" "}
                  {product.onSale && product.salePrice
                    ? product.salePrice.toLocaleString()
                    : product.price.toLocaleString()}
                </span>
                {product.onSale && product.salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      Save Rs.{" "}
                      {(product.price - product.salePrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stockStatus === "Available"
                  ? "bg-green-100 text-green-800"
                  : product.stockStatus === "Out of Stock"
                    ? "bg-red-100 text-red-800"
                    : product.stockStatus === "Limited Stock"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
              >
                {product.stockStatus === "Available" && (
                  <Check className="w-4 h-4 mr-1" />
                )}
                {product.stockStatus}
              </span>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                  {!selectedSize && (
                    <span className="text-sm text-red-500 font-medium">
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const sizeData = product.sizeAvailability?.[size];
                    const inStock = sizeData?.available && sizeData?.quantity > 0;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => inStock && handleSizeSelect(size)}
                        disabled={!inStock}
                        title={
                          inStock
                            ? `${sizeData.quantity} in stock`
                            : "Out of stock"
                        }
                        className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${isSelected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : inStock
                            ? "border-gray-200 hover:border-gray-900 text-gray-700"
                            : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                          }`}
                      >
                        {size}
                        {inStock && sizeData.quantity <= 5 && !isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[9px] font-bold rounded-full px-1">
                            {sizeData.quantity}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-500">
                    {product.sizeAvailability?.[selectedSize]?.quantity} units
                    available in size {selectedSize}
                  </p>
                )}
              </div>
            )}


            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={
                      selectedSize
                        ? quantity >=
                        (product.sizeAvailability?.[selectedSize]?.quantity ?? 1)
                        : false
                    }
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {selectedSize && (
                  <div className="text-sm text-gray-500">
                    Max:{" "}
                    {product.sizeAvailability?.[selectedSize]?.quantity ?? 0} in
                    stock
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-8 rounded-lg font-medium flex items-center justify-center transition-colors ${isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-8 rounded-lg font-medium transition-colors ${isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  }`}
              >
                {isOutOfStock ? "Unavailable" : "Buy Now"}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className="px-6 py-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${wishlist.includes(product._id)
                    ? "fill-rose-500 text-rose-500"
                    : "text-gray-700"
                    }`}
                />
              </button>
              <button className="px-6 py-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="font-medium text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Similar Products in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => {
                const similarImages = getProductImages(similarProduct);
                const similarDiscount =
                  similarProduct.onSale && similarProduct.salePrice
                    ? Math.round(
                      ((similarProduct.price - similarProduct.salePrice) /
                        similarProduct.price) *
                      100
                    )
                    : 0;

                return (
                  <div
                    key={similarProduct._id}
                    className="border rounded-xl overflow-hidden hover:shadow-xl transition group cursor-pointer"
                    onClick={() => navigate(`/product/${similarProduct._id}`)}
                  >
                    {/* Square image container */}
                    <div className="relative aspect-square bg-gray-50">
                      <Swiper
                        modules={[Navigation]}
                        navigation
                        className="h-full"
                      >
                        {similarImages.map((img, idx) => (
                          <SwiperSlide key={idx} className="h-full">
                            <img
                              src={img}
                              alt={similarProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {similarProduct.onSale && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                          -{similarDiscount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-2 text-lg group-hover:text-blue-600 transition-colors">
                        {similarProduct.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {similarProduct.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            Rs.{" "}
                            {similarProduct.onSale && similarProduct.salePrice
                              ? similarProduct.salePrice.toLocaleString()
                              : similarProduct.price.toLocaleString()}
                          </span>
                          {similarProduct.onSale &&
                            similarProduct.salePrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                Rs. {similarProduct.price.toLocaleString()}
                              </span>
                            )}
                        </div>

                        <button
                          className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Add to cart:", similarProduct._id);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductView;
