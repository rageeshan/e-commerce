import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  X,
  Edit2,
  Trash2,
  Package,
  Percent,
  AlertCircle,
  RefreshCw,
  Plus,
  Ruler,
  Hash,
  Check,
  Search,
  Grid3x3,
  List,
  Layers,
  Home,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Star,
  Clock,
  Filter,
  Download,
  Printer,
  MoreVertical,
  Eye,
  Tag,
  Box,
  Truck,
  BarChart3,
  PieChart,
  Upload,
  ImageIcon,
  FileText,
  PlusCircle,
  Minus,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  XCircle,
  CreditCard,
  Banknote,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Size options as a module-level constant to avoid re-creation
const SIZE_OPTIONS = {
  Clothes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  Shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  Accessories: ["42mm", "45mm", "One Size"],
  Bags: ["Small", "Medium", "Large", "Extra Large", "One Size"],
};

const STATUS_STYLES = {
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STYLES = {
  cod: "bg-gray-100 text-gray-600",
  pending: "bg-amber-50 text-amber-600",
  verified: "bg-green-50 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_LABELS = {
  cod: "COD", pending: "Pending Verification", verified: "Verified", cancelled: "Cancelled",
};

const PAYMENT_ICONS = {
  cod: <Banknote className="w-4 h-4" />,
  bank_transfer: <Wallet className="w-4 h-4" />,
  card: <CreditCard className="w-4 h-4" />,
};

const STATUSES = ["confirmed", "processing", "shipped", "cancelled"];

const AdminProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [verifyingOrderId, setVerifyingOrderId] = useState(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    category: "",
    name: "",
    price: "",
    salePrice: "",
    description: "",
    onSale: false,
  });
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

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
    sizes: [],
    sizeQuantities: {},
  });

  // Size Management Modal State
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedSizeProduct, setSelectedSizeProduct] = useState(null);
  const [sizeManagement, setSizeManagement] = useState({
    sizes: [],
    sizeQuantities: {},
  });
  const [newSize, setNewSize] = useState("");
  const [newSizeQuantity, setNewSizeQuantity] = useState(0);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState("");

  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5001);
  };

  // Define size options based on category
  const sizeOptions = {
    Clothes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    Shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    Accessories: ["42mm", "45mm", "One Size"],
    Bags: ["Small", "Medium", "Large", "Extra Large", "One Size"],
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/products?limit=100");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch (error) {
      console.error("❌ Fetch error:", error);
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch orders", "error");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        showToast(`Order status updated to ${status}`);
      } else {
        showToast("Failed to update order status", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to update order status", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Verify bank transfer payment
  const verifyPayment = async (orderId, paymentStatus) => {
    setVerifyingOrderId(orderId);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}/payment-status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        fetchOrders();
        showToast(`Payment marked as ${paymentStatus}`);
      } else {
        showToast("Failed to update payment status", "error");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingOrderId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Add Product - Update available sizes when category changes
  useEffect(() => {
    if (addFormData.category && SIZE_OPTIONS[addFormData.category]) {
      setAvailableSizes(SIZE_OPTIONS[addFormData.category]);
      setSizes([]);
      setSizeQuantities({});
    }
  }, [addFormData.category]);

  // Add Product Handlers
  const handleAddFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4));
  }, []);

  const removeImage = useCallback(
    (index) => {
      URL.revokeObjectURL(images[index].preview);
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    [images]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleSizeToggle = useCallback((size) => {
    setSizes((prev) => {
      if (prev.includes(size)) {
        const newSizes = prev.filter((s) => s !== size);
        setSizeQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[size];
          return newQuantities;
        });
        return newSizes;
      } else {
        setSizeQuantities((prev) => ({
          ...prev,
          [size]: 0,
        }));
        return [...prev, size];
      }
    });
  }, []);

  const handleQuantityChange = useCallback((size, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, numQuantity),
    }));
  }, []);

  const calculateTotalStockForAdd = useCallback(() => {
    return Object.values(sizeQuantities).reduce(
      (total, qty) => total + (parseInt(qty) || 0),
      0
    );
  }, [sizeQuantities]);

  const getStockStatusForAdd = useCallback((totalStock) => {
    if (totalStock === 0) return "Out of Stock";
    if (totalStock <= 5) return "Low Stock";
    if (totalStock <= 10) return "Limited Stock";
    return "Available";
  }, []);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!addFormData.category) {
        showToast("Please select a category", "error");
        setIsSubmitting(false);
        return;
      }

      if (!addFormData.name.trim()) {
        showToast("Product name is required", "error");
        setIsSubmitting(false);
        return;
      }

      if (!addFormData.price || Number(addFormData.price) <= 0) {
        showToast("Please enter a valid price", "error");
        setIsSubmitting(false);
        return;
      }

      if (!addFormData.description.trim()) {
        showToast("Product description is required", "error");
        setIsSubmitting(false);
        return;
      }

      if (addFormData.onSale && (!addFormData.salePrice || Number(addFormData.salePrice) <= 0)) {
        showToast("Sale price is required when product is on sale", "error");
        setIsSubmitting(false);
        return;
      }

      if (addFormData.onSale && Number(addFormData.salePrice) >= Number(addFormData.price)) {
        showToast("Sale price must be lower than the original price", "error");
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        showToast("Please upload at least one product image", "error");
        setIsSubmitting(false);
        return;
      }

      if (sizes.length === 0) {
        showToast("Please select at least one size", "error");
        setIsSubmitting(false);
        return;
      }

      const form = new FormData();
      images.forEach((img) => form.append("image", img.file));
      form.append("category", addFormData.category);
      form.append("name", addFormData.name.trim());
      form.append("price", parseFloat(addFormData.price).toString());
      form.append("description", addFormData.description.trim());
      form.append("onSale", addFormData.onSale.toString());
      form.append("sizes", JSON.stringify(sizes));

      const sizeQuantitiesObj = {};
      sizes.forEach((size) => {
        sizeQuantitiesObj[size] = parseInt(sizeQuantities[size] || 0);
      });
      form.append("sizeQuantities", JSON.stringify(sizeQuantitiesObj));

      if (addFormData.onSale && addFormData.salePrice) {
        form.append("salePrice", parseFloat(addFormData.salePrice).toString());
      }

      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        body: form,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to add product");
      }

      fetchProducts();
      closeAddModal();
      showToast("Product added successfully!");
    } catch (error) {
      console.error("Error in handleAddProductSubmit:", error);
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setAddFormData({
      category: "",
      name: "",
      price: "",
      salePrice: "",
      description: "",
      onSale: false,
    });
    setImages([]);
    setSizes([]);
    setSizeQuantities({});
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    images.forEach(img => URL.revokeObjectURL(img.preview));
  };

  // Handle form input changes for update modal
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
    const sizeQuantitiesObj = {};
    if (product.sizeAvailability && typeof product.sizeAvailability === "object") {
      Object.keys(product.sizeAvailability).forEach((size) => {
        sizeQuantitiesObj[size] = product.sizeAvailability[size]?.quantity || 0;
      });
    }
    setFormData({
      category: product.category,
      name: product.name,
      price: product.price,
      description: product.description,
      stockStatus: product.stockStatus,
      onSale: product.onSale,
      salePrice: product.salePrice || "",
      sizes: product.sizes || [],
      sizeQuantities: sizeQuantitiesObj,
    });
    setIsModalOpen(true);
  };

  // Open size management modal
  const openSizeModal = (product) => {
    setSelectedSizeProduct(product);
    const sizeQuantitiesObj = {};
    if (product.sizeAvailability && typeof product.sizeAvailability === "object") {
      Object.keys(product.sizeAvailability).forEach((size) => {
        sizeQuantitiesObj[size] = product.sizeAvailability[size]?.quantity || 0;
      });
    }
    setSizeManagement({
      sizes: product.sizes || [],
      sizeQuantities: sizeQuantitiesObj,
    });
    setNewSize("");
    setNewSizeQuantity(0);
    setIsSizeModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeSizeModal = () => {
    setIsSizeModalOpen(false);
    setSelectedSizeProduct(null);
    setSizeManagement({ sizes: [], sizeQuantities: {} });
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.onSale && Number(formData.salePrice) >= Number(formData.price)) {
      showToast("Sale price must be lower than original price", "error");
      return;
    }

    const payload = {
      category: formData.category,
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      stockStatus: formData.stockStatus,
      onSale: formData.onSale,
      sizes: formData.sizes,
      sizeQuantities: formData.sizeQuantities,
    };

    if (formData.onSale) {
      payload.salePrice = Number(formData.salePrice);
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
      showToast("Product updated successfully!");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  // Handle size management
  const handleSizeQuantityChange = (size, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setSizeManagement((prev) => ({
      ...prev,
      sizeQuantities: {
        ...prev.sizeQuantities,
        [size]: Math.max(0, numQuantity),
      },
    }));
  };

  const addNewSize = () => {
    if (!newSize.trim() || !selectedSizeProduct) return;

    const category = selectedSizeProduct.category;
    const validSizes = sizeOptions[category] || [];

    if (!validSizes.includes(newSize)) {
      showToast(
        `Invalid size "${newSize}" for ${category} category. Valid sizes: ${validSizes.join(", ")}`,
        "error"
      );
      return;
    }

    if (sizeManagement.sizes.includes(newSize)) {
      showToast(`Size "${newSize}" already exists for this product`, "error");
      return;
    }

    setSizeManagement((prev) => ({
      sizes: [...prev.sizes, newSize],
      sizeQuantities: {
        ...prev.sizeQuantities,
        [newSize]: Math.max(0, parseInt(newSizeQuantity) || 0),
      },
    }));

    setNewSize("");
    setNewSizeQuantity(0);
    showToast(`Size "${newSize}" added successfully!`);
  };

  const removeSize = (sizeToRemove) => {
    setSizeManagement((prev) => {
      const newSizes = prev.sizes.filter((size) => size !== sizeToRemove);
      const newSizeQuantities = { ...prev.sizeQuantities };
      delete newSizeQuantities[sizeToRemove];
      return {
        sizes: newSizes,
        sizeQuantities: newSizeQuantities,
      };
    });
    showToast(`Size "${sizeToRemove}" removed`);
  };

  const updateSizeStock = async () => {
    if (!selectedSizeProduct) return;

    try {
      const payload = {
        name: selectedSizeProduct.name,
        price: selectedSizeProduct.price,
        category: selectedSizeProduct.category,
        description: selectedSizeProduct.description,
        onSale: selectedSizeProduct.onSale,
        salePrice: selectedSizeProduct.salePrice,
        sizes: sizeManagement.sizes,
        sizeQuantities: sizeManagement.sizeQuantities,
      };

      const res = await fetch(
        `http://localhost:5001/api/products/${selectedSizeProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Size update failed");

      fetchProducts();
      closeSizeModal();
      showToast("Size inventory updated successfully!");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  // Calculate total stock for a product
  const calculateTotalStock = (product) => {
    if (!product.sizeAvailability || typeof product.sizeAvailability !== "object") {
      return 0;
    }
    let total = 0;
    Object.values(product.sizeAvailability).forEach((data) => {
      total += data.quantity || 0;
    });
    return total;
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
      showToast("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
    setDeleteProductName("");
    setIsDeleteOpen(false);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return calculateTotalStock(a) - calculateTotalStock(b);
      return 0;
    });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchSearch = !ordersSearch || order.email?.includes(ordersSearch) ||
      order.firstName?.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      order._id.includes(ordersSearch);
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Get categories for filter
  const categories = [...new Set(products.map((p) => p.category))];

  // Get image URL
  const getImageUrl = (product) => {
    if (!product.image || product.image.length === 0) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
    }
    const validImages = product.image.filter(
      (img) => img && !img.includes("…") && !img.includes("...")
    );
    const imageFilename = validImages.length > 0 ? validImages[0] : product.image[0];
    const encodedFilename = encodeURIComponent(imageFilename);
    return `http://localhost:5001/uploads/${encodedFilename}`;
  };

  // Get stock status color
  const getStockStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "bg-emerald-100 text-emerald-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      case "Limited Stock":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Calculate dashboard stats
  const totalStock = products.reduce((total, product) => total + calculateTotalStock(product), 0);
  const totalValue = products.reduce((total, product) => {
    const price = product.onSale ? product.salePrice : product.price;
    return total + (price * calculateTotalStock(product));
  }, 0);
  const lowStockProducts = products.filter(p => calculateTotalStock(p) > 0 && calculateTotalStock(p) < 10).length;

  // Orders stats
  const ordersStats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    revenue: orders.filter(o => o.status !== "cancelled" && (o.paymentStatus === "verified" || o.paymentStatus === "cod")).reduce((s, o) => s + o.totalAmount, 0),
  };

  const addTotalStock = calculateTotalStockForAdd();
  const addStockStatus = getStockStatusForAdd(addTotalStock);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "text-indigo-500" },
    { id: "products", label: "Products", icon: ShoppingBag, color: "text-emerald-500" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "text-blue-500" },
    { id: "customers", label: "Customers", icon: Users, color: "text-purple-500" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-amber-500" },
    { id: "settings", label: "Settings", icon: Settings, color: "text-gray-500" },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-6 w-6 text-indigo-600 opacity-50" />
            </div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 ${toast.type === "error"
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}>
            {toast.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <Check size={18} />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? "w-20" : "w-72"} bg-white shadow-xl transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className={`p-5 border-b border-slate-100 flex ${sidebarCollapsed ? "justify-center" : "justify-between"} items-center`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">ShopAdmin</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? item.color : "text-slate-400 group-hover:text-slate-600"} />
              {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              {!sidebarCollapsed && activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t border-slate-100 ${sidebarCollapsed ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Admin User</p>
                <p className="text-xs text-slate-400">admin@shop.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-72"}`}>
        <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === "products" ? "Product Management" :
                  activeTab === "dashboard" ? "Dashboard Overview" :
                    activeTab === "orders" ? "Order Management" :
                      activeTab === "customers" ? "Customer Management" :
                        activeTab === "analytics" ? "Analytics" : "Settings"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {activeTab === "products" ? "Manage your store inventory and track stock levels" :
                  activeTab === "orders" ? "Track and manage customer orders" :
                    "Welcome back, here's what's happening with your store today"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Bell size={20} className="text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Mail size={20} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
                  <p className="text-indigo-100 mb-4">Here's your store performance overview for today</p>
                  <div className="flex gap-4">
                    <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <p className="text-xs text-indigo-100">Total Revenue</p>
                      <p className="text-xl font-bold">Rs {totalValue.toLocaleString("si-LK")}</p>
                    </div>
                    <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <p className="text-xs text-indigo-100">Products Sold</p>
                      <p className="text-xl font-bold">1,234</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <TrendingUp size={40} className="text-white/70" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-slate-800">{products.length}</p>
                    <p className="text-xs text-emerald-600 mt-1">+12 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Package className="text-emerald-500" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Stock Units</p>
                    <p className="text-2xl font-bold text-slate-800">{totalStock.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 mt-1">Across all sizes</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Hash className="text-amber-500" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Low Stock Alert</p>
                    <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
                    <p className="text-xs text-red-500 mt-1">Need restocking</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">On Sale Items</p>
                    <p className="text-2xl font-bold text-purple-600">{products.filter(p => p.onSale).length}</p>
                    <p className="text-xs text-purple-500 mt-1">Special offers</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Percent className="text-purple-500" size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <PieChart size={18} className="text-indigo-500" />
                  Category Distribution
                </h3>
                <div className="space-y-3">
                  {categories.map(cat => {
                    const count = products.filter(p => p.category === cat).length;
                    const percentage = (count / products.length * 100).toFixed(0);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{cat}</span>
                          <span className="font-medium text-slate-700">{count} items ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-amber-500" />
                  Recent Products
                </h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map(product => (
                    <div key={product._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <img src={getImageUrl(product)} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-700 text-sm">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-700">Rs {product.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products View */}
        {activeTab === "products" && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs">Total Products</p>
                    <p className="text-2xl font-bold text-slate-800">{products.length}</p>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <Package className="text-indigo-500" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs">On Sale</p>
                    <p className="text-2xl font-bold text-amber-600">{products.filter(p => p.onSale).length}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Percent className="text-amber-500" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stockStatus === "Out of Stock").length}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-xl">
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs">Total Stock</p>
                    <p className="text-2xl font-bold text-emerald-600">{totalStock.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Hash className="text-emerald-500" size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
                <div className="flex gap-3">
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="stock">Sort by Stock</option>
                  </select>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 px-4 transition-colors ${viewMode === "grid" ? "bg-indigo-500 text-white" : "text-slate-500"}`}>
                      <Grid3x3 size={18} />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2.5 px-4 transition-colors ${viewMode === "list" ? "bg-indigo-500 text-white" : "text-slate-500"}`}>
                      <List size={18} />
                    </button>
                  </div>
                  <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                    <Plus size={18} />
                    Add Product
                  </button>
                  <button onClick={fetchProducts} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => {
                  const imageUrl = getImageUrl(product);
                  const totalStock = calculateTotalStock(product);
                  const sizes = product.sizes || [];
                  const sizeAvailability = product.sizeAvailability || {};

                  return (
                    <div key={product._id} className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <img src={imageUrl} alt={product.name} className="h-56 w-full object-cover bg-slate-100 transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button onClick={() => openUpdateModal(product)} className="p-2 bg-white rounded-lg hover:bg-indigo-50 transition-colors shadow-md">
                            <Edit2 size={16} className="text-indigo-600" />
                          </button>
                          <button onClick={() => openSizeModal(product)} className="p-2 bg-white rounded-lg hover:bg-emerald-50 transition-colors shadow-md">
                            <Ruler size={16} className="text-emerald-600" />
                          </button>
                          <button onClick={() => openDeleteModal(product._id, product.name)} className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors shadow-md">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                        {product.onSale && (
                          <div className="absolute bottom-3 left-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-md">
                              {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full mt-1">
                              {product.category}
                            </span>
                          </div>
                          <div className="text-right ml-2">
                            {product.onSale ? (
                              <>
                                <p className="text-red-600 font-bold">Rs {product.salePrice?.toLocaleString()}</p>
                                <p className="text-slate-400 line-through text-xs">Rs {product.price.toLocaleString()}</p>
                              </>
                            ) : (
                              <p className="text-slate-800 font-bold">Rs {product.price.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-500">Sizes:</span>
                            <span className="text-xs text-slate-500">Total: <span className="font-bold">{totalStock}</span></span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {sizes.slice(0, 4).map((size) => {
                              const quantity = sizeAvailability[size]?.quantity || 0;
                              return (
                                <span key={size} className={`px-1.5 py-0.5 text-xs rounded ${quantity > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"}`}>
                                  {size}
                                </span>
                              );
                            })}
                            {sizes.length > 4 && <span className="text-xs text-slate-400">+{sizes.length - 4}</span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusStyle(product.stockStatus)}`}>
                            {product.stockStatus}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => openUpdateModal(product)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100">
                              Edit
                            </button>
                            <button onClick={() => openSizeModal(product)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100">
                              Sizes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Product</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Category</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Price</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Stock</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={getImageUrl(product)} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-medium text-slate-800">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">{product.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            {product.onSale ? (
                              <div>
                                <span className="text-red-600 font-medium">Rs {product.salePrice?.toLocaleString()}</span>
                                <span className="text-slate-400 line-through text-xs ml-1">Rs {product.price.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="font-medium">Rs {product.price.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{calculateTotalStock(product)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusStyle(product.stockStatus)}`}>
                              {product.stockStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button onClick={() => openUpdateModal(product)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => openSizeModal(product)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                <Ruler size={16} />
                              </button>
                              <button onClick={() => openDeleteModal(product._id, product.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500">
                  {searchTerm || selectedCategory ? "Try adjusting your filters" : "Get started by adding your first product"}
                </p>
                {!searchTerm && !selectedCategory && (
                  <button onClick={openAddModal} className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                    + Add Product
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="p-6 space-y-6">
            {/* Orders Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: "Total Orders", value: ordersStats.total, icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
                { label: "Confirmed", value: ordersStats.confirmed, icon: <CheckCircle className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
                { label: "Processing", value: ordersStats.processing, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
                { label: "Shipped", value: ordersStats.shipped, icon: <Truck className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
                { label: "Revenue", value: `Rs ${ordersStats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                  <div className={`p-2.5 rounded-xl ${s.bg}`}>{s.icon}</div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={ordersSearch}
                  onChange={e => setOrdersSearch(e.target.value)}
                  placeholder="Search by name, email or order ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
              <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Order Row */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{order.firstName} {order.lastName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STYLES[order.paymentStatus]}`}>{PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">{order.email} · {order.city} · {new Date(order.createdAt).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="font-mono">{order._id.slice(-8).toUpperCase()}</span>
                          <span>·</span>
                          {PAYMENT_ICONS[order.paymentMethod] || <Banknote className="w-4 h-4" />}
                          <span className="capitalize">{order.paymentMethod?.replace("_", " ")}</span>
                          <span>·</span>
                          <span>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">Rs {order.totalAmount?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 capitalize">{order.shippingMethod}</p>
                        </div>
                        {/* Bank transfer payment verification dropdown */}
                        {order.paymentMethod === "bank_transfer" && order.paymentStatus === "pending" && (
                          <div className="relative">
                            <select
                              defaultValue=""
                              onChange={e => { if (e.target.value) verifyPayment(order._id, e.target.value); }}
                              disabled={verifyingOrderId === order._id}
                              className="pl-3 pr-8 py-2 border-2 border-amber-300 bg-amber-50 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none disabled:opacity-50 text-amber-700"
                            >
                              <option value="" disabled>Payment?</option>
                              <option value="verified">✓ Verified</option>
                              <option value="cancelled">✗ Declined</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-500 pointer-events-none" />
                          </div>
                        )}
                        {/* Order status dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                            disabled={updatingOrderId === order._id || order.status === "shipped" || order.status === "cancelled"}
                            className="pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white capitalize appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Items */}
                    {expandedOrder === order._id && (
                      <div className="border-t border-gray-50 px-5 py-4 bg-gray-50/50 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Items</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.image ? <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" /> : <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                              <p className="text-xs text-gray-400">Size: {item.size} · Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-sm text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs {order.subtotal?.toLocaleString()}</span></div>
                          <div className="flex justify-between text-gray-500"><span>Shipping</span><span>Rs {order.shippingCost?.toLocaleString()}</span></div>
                          <div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>Rs {order.totalAmount?.toLocaleString()}</span></div>
                        </div>
                        <div className="border-t border-gray-100 pt-3 text-xs text-gray-400 space-y-1">
                          <p><span className="font-semibold text-gray-600">Deliver to: </span>{order.address}{order.apartment ? `, ${order.apartment}` : ""}, {order.city}{order.postalCode ? ` ${order.postalCode}` : ""}</p>
                          <p><span className="font-semibold text-gray-600">Phone: </span>{order.phone}</p>
                          {order.receiptUrl && <p><span className="font-semibold text-gray-600">Receipt: </span><a href={order.receiptUrl} target="_blank" rel="noreferrer" className="text-indigo-500 underline">View Receipt</a></p>}
                          {order.notes && <p><span className="font-semibold text-gray-600">Notes: </span>{order.notes}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === "customers" || activeTab === "analytics" || activeTab === "settings") && (
          <div className="p-6">
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Package className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
              <p className="text-slate-500">This section is under development. Coming soon!</p>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
                <p className="text-slate-500 text-sm">Fill in the product details below</p>
              </div>
              <button onClick={closeAddModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2 text-indigo-600" />
                    Product Images *
                  </label>
                  <span className="text-sm text-gray-500">{images.length}/4 images</span>
                </div>

                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-3">
                    <Upload className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1">Click to upload images</p>
                  <p className="text-gray-500 text-xs">PNG, JPG, WEBP up to 5MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-slate-50">
                          <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Category *</label>
                  <select name="category" value={addFormData.category} onChange={handleAddFormChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option value="">Select Category</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Product Name *</label>
                  <input type="text" name="name" placeholder="e.g., Premium Leather Jacket" value={addFormData.name} onChange={handleAddFormChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Price (LKR) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
                    <input type="number" name="price" placeholder="0.00" value={addFormData.price} onChange={handleAddFormChange} required min="0" step="0.01" className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Ruler className="w-4 h-4 mr-2 text-gray-500" />
                    Select Sizes * ({sizes.length} selected)
                  </label>
                  {addFormData.category ? (
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-slate-50 min-h-[56px]">
                      {availableSizes.map((size) => (
                        <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${sizes.includes(size) ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-400"}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center border border-gray-200 rounded-xl bg-slate-50">
                      <p className="text-gray-500 text-sm">Select a category first to see available sizes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Quantities */}
              {sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Stock Quantities by Size</h3>
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-bold text-indigo-700">{addTotalStock}</span> units
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{addStockStatus}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <div key={size} className="border border-gray-200 rounded-xl p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{size}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${(sizeQuantities[size] || 0) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {(sizeQuantities[size] || 0) > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <button type="button" onClick={() => handleQuantityChange(size, (sizeQuantities[size] || 0) - 1)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg bg-white hover:bg-gray-50">
                            <Minus size={14} />
                          </button>
                          <input type="number" min="0" value={sizeQuantities[size] || 0} onChange={(e) => handleQuantityChange(size, e.target.value)} className="flex-1 h-8 text-center border-t border-b border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <button type="button" onClick={() => handleQuantityChange(size, (sizeQuantities[size] || 0) + 1)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg bg-white hover:bg-gray-50">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Description *
                </label>
                <textarea name="description" placeholder="Provide a detailed description of your product..." value={addFormData.description} onChange={handleAddFormChange} rows="4" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none" />
              </div>

              {/* Sale Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">On Sale</span>
                      <p className="text-xs text-gray-500">Enable special pricing</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="onSale" checked={addFormData.onSale} onChange={handleAddFormChange} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                  </label>
                </div>

                {addFormData.onSale && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Sale Price (LKR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
                      <input type="number" name="salePrice" placeholder="Enter sale price" value={addFormData.salePrice} onChange={handleAddFormChange} min="0" step="0.01" className="w-full pl-8 pr-4 py-2.5 border border-amber-200 bg-amber-50 rounded-xl focus:ring-2 focus:ring-amber-500" />
                    </div>
                    {addFormData.price && addFormData.salePrice && (
                      <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-bold text-emerald-600">{((1 - addFormData.salePrice / addFormData.price) * 100).toFixed(0)}% OFF</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={images.length === 0 || sizes.length === 0 || isSubmitting} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Product to Store
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Update Product</h2>
                <p className="text-slate-500 text-sm">Edit product details below</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Price (LKR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">Rs</span>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option value="">Select Category</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Stock Status</label>
                  <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700">Product Sizes</h3>
                  <button type="button" onClick={() => openSizeModal(selectedProduct)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Manage Sizes
                  </button>
                </div>
                {formData.sizes && formData.sizes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formData.sizes.map((size) => (
                      <div key={size} className="border border-slate-100 rounded-lg p-2 bg-slate-50">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">{size}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${(formData.sizeQuantities[size] || 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {formData.sizeQuantities[size] || 0} in stock
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Ruler className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-slate-500 text-sm">No sizes configured</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Percent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">On Sale</span>
                    <p className="text-xs text-slate-500">Enable special pricing</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="onSale" checked={formData.onSale} onChange={handleChange} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                </label>
              </div>

              {formData.onSale && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Sale Price (LKR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">Rs</span>
                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required className="w-full pl-8 pr-4 py-2.5 border border-amber-200 bg-amber-50 rounded-xl focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl hover:from-indigo-700 transition-all shadow-md">
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Size Management Modal */}
      {isSizeModalOpen && selectedSizeProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Manage Sizes</h2>
                <p className="text-slate-500 text-sm">{selectedSizeProduct.name} - {selectedSizeProduct.category}</p>
              </div>
              <button onClick={closeSizeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700">Add New Size</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-slate-600 block mb-1">Size</label>
                    <select value={newSize} onChange={(e) => setNewSize(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50">
                      <option value="">Select Size</option>
                      {sizeOptions[selectedSizeProduct.category]?.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 block mb-1">Initial Quantity</label>
                    <input type="number" min="0" value={newSizeQuantity} onChange={(e) => setNewSizeQuantity(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={addNewSize} disabled={!newSize} className="w-full py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                      Add Size
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700">Current Sizes ({sizeManagement.sizes.length})</h3>
                  <div className="text-sm text-slate-600">
                    Total Stock: <span className="font-bold text-emerald-600">
                      {Object.values(sizeManagement.sizeQuantities).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0)}
                    </span>
                  </div>
                </div>
                {sizeManagement.sizes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sizeManagement.sizes.map((size) => (
                      <div key={size} className="border border-slate-100 rounded-xl p-3 bg-slate-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700">{size}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${(sizeManagement.sizeQuantities[size] || 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {(sizeManagement.sizeQuantities[size] || 0) > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                          <button onClick={() => removeSize(size)} className="p-1 hover:bg-slate-200 rounded-lg">
                            <X size={14} className="text-slate-500" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button type="button" onClick={() => handleSizeQuantityChange(size, (sizeManagement.sizeQuantities[size] || 0) - 1)} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-l-lg bg-white hover:bg-slate-50">-</button>
                          <input type="number" min="0" value={sizeManagement.sizeQuantities[size] || 0} onChange={(e) => handleSizeQuantityChange(size, e.target.value)} className="flex-1 h-8 text-center border-t border-b border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <button type="button" onClick={() => handleSizeQuantityChange(size, (sizeManagement.sizeQuantities[size] || 0) + 1)} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-r-lg bg-white hover:bg-slate-50">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Ruler className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">No sizes configured</p>
                  </div>
                )}
              </div>

              <button onClick={updateSizeStock} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-700 transition-all shadow-md">
                Save Size Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Product</h3>
              <p className="text-slate-500 mb-5">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deleteProductName}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={cancelDelete} className="px-5 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-5 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600">
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

// Missing icons
const Bell = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const Mail = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;

export default AdminProductView;