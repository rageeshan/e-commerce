import { useEffect, useState } from "react";
import {
  X,
  Edit2,
  Trash2,
  Eye,
  Package,
  Tag,
  DollarSign,
  Percent,
  AlertCircle,
  RefreshCw,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Update Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    stockStatus: "",
    onSale: false,
    salePrice: "",
  });

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState("");

  // Fetch Products with debug
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();

      // Debug: Log image data
      console.log("📦 Products data received:", data.length, "products");
      data.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.name}`);
        console.log("  Images:", product.image);
        console.log("  Image count:", product.image?.length);
        if (product.image && product.image.length > 0) {
          product.image.forEach((img, i) => {
            console.log(`  Image ${i}: "${img}" (length: ${img?.length})`);
            if (img && (img.includes("…") || img.includes("..."))) {
              console.log("  ⚠️ WARNING: Truncated filename detected!");
            }
          });
        }
      });

      setProducts(data);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open update modal
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      category: product.category,
      name: product.name,
      price: product.price,
      description: product.description,
      stockStatus: product.stockStatus,
      onSale: product.onSale,
      salePrice: product.salePrice || "",
    });
    setIsModalOpen(true);
  };

  // Close update modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate sale price
    if (
      formData.onSale &&
      Number(formData.salePrice) >= Number(formData.price)
    ) {
      alert("Sale price must be lower than original price");
      return;
    }

    const payload = {
      category: formData.category,
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      stockStatus: formData.stockStatus,
      onSale: formData.onSale,
    };

    if (formData.onSale) {
      payload.salePrice = Number(formData.salePrice);
    } else {
      payload.salePrice = undefined;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      fetchProducts();
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Delete product
  const openDeleteModal = (id, name) => {
    setDeleteProductId(id);
    setDeleteProductName(name);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${deleteProductId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      fetchProducts();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
    setDeleteProductName("");
    setIsDeleteOpen(false);
  };

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/addProduct"); // Replace with your path
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get one valid image URL from the product
  const getImageUrl = (product) => {
    // 1️⃣ If no images, return placeholder
    if (!product.image || product.image.length === 0) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
    }

    // 2️⃣ Filter out truncated or invalid filenames
    const validImages = product.image.filter(
      (img) => img && !img.includes("…") && !img.includes("...")
    );

    // 3️⃣ Use first valid image, or fallback to first image anyway
    const imageFilename =
      validImages.length > 0 ? validImages[0] : product.image[0];

    // 4️⃣ Encode the filename for URL safety
    const encodedFilename = encodeURIComponent(imageFilename);

    return `http://localhost:5001/uploads/${encodedFilename}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your store inventory</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRedirect}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
                Add Product
              </button>
              <button
                onClick={fetchProducts}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw />
                Refresh
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
                <Eye
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">On Sale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter((p) => p.onSale).length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Percent className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      products.filter((p) => p.stockStatus === "Out of Stock")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(products.map((p) => p.category)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Tag className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product);

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative group">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover bg-gray-100"
                    onError={(e) => {
                      console.error("Image failed to load for:", product.name);
                      console.error("Attempted URL:", imageUrl);
                      console.error("Product images:", product.image);

                      // Fallback to placeholder
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
                      e.target.className =
                        "h-56 w-full object-cover bg-gray-200";
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully:", product.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openUpdateModal(product)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
                      title="Edit Product"
                    >
                      <Edit2 size={16} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product._id, product.name)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
                      title="Delete Product"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    {product.onSale && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                        {Math.round(
                          (1 - product.salePrice / product.price) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  {/* Debug badge - shows image count */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {product.image?.length || 0} images
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mt-1">
                        {product.category}
                      </span>
                    </div>
                    <div className="text-right">
                      {product.onSale ? (
                        <div>
                          <p className="text-red-600 font-bold text-lg">
                            Rs {product.salePrice?.toLocaleString("si-LK")}
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            Rs {product.price.toLocaleString("si-LK")}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-900 font-bold text-lg">
                          Rs {product.price.toLocaleString("si-LK")}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        product.stockStatus === "Available"
                          ? "bg-green-100 text-green-800"
                          : product.stockStatus === "Out of Stock"
                          ? "bg-red-100 text-red-800"
                          : product.stockStatus === "Limited Stock"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {product.stockStatus === "Available" && ""}
                      {product.stockStatus === "Out of Stock" && ""}
                      {product.stockStatus === "Limited Stock" && ""}
                      {product.stockStatus}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          openDeleteModal(product._id, product.name)
                        }
                        className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Debug section - shows actual filenames */}
                  {/* <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <ImageIcon size={12} className="mr-1" />
                      <span className="truncate">
                        {product.image && product.image[0]
                          ? product.image[0].length > 30
                            ? `${product.image[0].substring(0, 30)}...`
                            : product.image[0]
                          : "No image"}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No products match "${searchTerm}"`
                : "No products available"}
            </p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Update Product
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit product details below
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                      Rs
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stock Status
                  </label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Percent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">On Sale</span>
                    <p className="text-sm text-gray-500">
                      Enable special pricing
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                </label>
              </div>

              {formData.onSale && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sale Price (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                      Rs
                    </span>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-amber-300 bg-amber-50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                  {formData.price && formData.salePrice && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="font-bold text-green-600">
                          {(
                            (1 - formData.salePrice / formData.price) *
                            100
                          ).toFixed(0)}
                          % OFF
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  "{deleteProductName}"
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductView;
