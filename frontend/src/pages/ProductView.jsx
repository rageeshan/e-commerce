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

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  //   const [selectedSize, setSelectedSize] = useState(null);
  //   const [selectedColor, setSelectedColor] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);

        // Fetch similar products from same category
        const allProductsRes = await axios.get(
          "http://localhost:5001/api/products"
        );
        const similar = allProductsRes.data
          .filter(
            (p) => p.category === res.data.category && p._id !== res.data._id
          )
          .slice(0, 4); // Show 4 similar products
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
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", {
      productId: product._id,
      name: product.name,
      quantity,
      price:
        product.onSale && product.salePrice ? product.salePrice : product.price,
      total:
        (product.onSale && product.salePrice
          ? product.salePrice
          : product.price) * quantity,
    });
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log("Buy now:", {
      productId: product._id,
      name: product.name,
      quantity,
      price:
        product.onSale && product.salePrice ? product.salePrice : product.price,
      total:
        (product.onSale && product.salePrice
          ? product.salePrice
          : product.price) * quantity,
    });
    alert(`Proceeding to checkout with ${quantity} ${product.name}!`);
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stockStatus === "Available"
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
                    className="px-4 py-3 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Only {product.stockQuantity || "many"} items left
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className="px-6 py-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    wishlist.includes(product._id)
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
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Status</p>
                  <p className="font-medium">{product.stockStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">On Sale</p>
                  <p className="font-medium">{product.onSale ? "Yes" : "No"}</p>
                </div>
                {product.material && (
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{product.material}</p>
                  </div>
                )}
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
