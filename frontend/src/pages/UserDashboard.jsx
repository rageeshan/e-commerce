import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Bell,
  ChevronRight,
  Edit,
  Star,
  MessageSquare,
  Eye,
  Trash2,
  Download,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage and sample data for other info
  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Get user data from localStorage (saved during login)
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!savedUser || !token) {
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        // Set user data from login
        setUserData({
          ...parsedUser,
          // Generate avatar if not provided
          avatar:
            parsedUser.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
              parsedUser.name || parsedUser.email
            }`,
          // Add default stats if not present
          stats: parsedUser.stats || {
            totalOrders: 0,
            totalSpent: 0,
            pendingOrders: 0,
            completedOrders: 0,
          },
          // Add joinDate if not present
          joinDate:
            parsedUser.joinDate || new Date().toISOString().split("T")[0],
          // Add phone if not present
          phone: parsedUser.phone || "+91 98765 43210",
          // Add address if not present
          address: parsedUser.address || {
            street: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
          },
        });

        // Sample orders data (replace with API call)
        setOrders([
          {
            id: "ORD001",
            date: "2024-03-15",
            items: 3,
            total: 4567,
            status: "delivered",
            tracking: "TRK123456789",
            itemsDetails: [
              { name: "Premium T-Shirt", price: 1299, quantity: 1 },
              { name: "Casual Jeans", price: 2568, quantity: 1 },
              { name: "Leather Belt", price: 700, quantity: 1 },
            ],
          },
          {
            id: "ORD002",
            date: "2024-03-10",
            items: 2,
            total: 3245,
            status: "processing",
            tracking: "TRK987654321",
            itemsDetails: [
              { name: "Running Shoes", price: 2999, quantity: 1 },
              { name: "Sports Socks", price: 246, quantity: 2 },
            ],
          },
          {
            id: "ORD003",
            date: "2024-03-05",
            items: 1,
            total: 1499,
            status: "shipped",
            tracking: "TRK456789123",
            itemsDetails: [{ name: "Winter Jacket", price: 1499, quantity: 1 }],
          },
          {
            id: "ORD004",
            date: "2024-02-28",
            items: 4,
            total: 7890,
            status: "cancelled",
            tracking: null,
            itemsDetails: [
              { name: "Formal Shirt", price: 1899, quantity: 2 },
              { name: "Dress Pants", price: 2092, quantity: 1 },
              { name: "Neck Tie", price: 2000, quantity: 1 },
            ],
          },
        ]);

        // Sample wishlist data (replace with API call)
        setWishlist([
          {
            id: "PROD001",
            name: "Premium Leather Jacket",
            price: 7999,
            originalPrice: 9999,
            image:
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
            category: "Clothes",
            rating: 4.8,
            reviews: 42,
            inStock: true,
          },
          {
            id: "PROD002",
            name: "Designer Sunglasses",
            price: 3499,
            originalPrice: 4499,
            image:
              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
            category: "Accessories",
            rating: 4.5,
            reviews: 28,
            inStock: true,
          },
          {
            id: "PROD003",
            name: "Running Shoes Pro",
            price: 5599,
            originalPrice: 6999,
            image:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            category: "Shoes",
            rating: 4.9,
            reviews: 156,
            inStock: false,
          },
          {
            id: "PROD004",
            name: "Premium Backpack",
            price: 2999,
            originalPrice: 3999,
            image:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
            category: "Bags",
            rating: 4.7,
            reviews: 89,
            inStock: true,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "processing":
        return <Clock className="w-5 h-5" />;
      case "shipped":
        return <Package className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate stats from orders
  const calculateStats = () => {
    if (!orders.length) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) =>
      ["processing", "shipped"].includes(order.status)
    ).length;
    const completedOrders = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    return {
      totalOrders: orders.length,
      totalSpent,
      pendingOrders,
      completedOrders,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-gray-300">{userData.email}</p>
                <p className="text-sm text-gray-400 mt-1">{userData.phone}</p>
                {userData.joinDate && (
                  <p className="text-sm text-gray-400">
                    Member since {formatDate(userData.joinDate)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "orders", label: "My Orders", icon: ShoppingBag },
                  { id: "wishlist", label: "Wishlist", icon: Heart },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  {
                    id: "payments",
                    label: "Payment Methods",
                    icon: CreditCard,
                  },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </nav>

              {/* Stats Summary */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="font-semibold">{stats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-semibold">
                      ₹{stats.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Pending Orders
                    </span>
                    <span className="font-semibold">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Completed Orders
                    </span>
                    <span className="font-semibold">
                      {stats.completedOrders}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {userData.name.split(" ")[0]}!
                  </h2>
                  <p className="text-blue-100 mb-6">
                    You have {stats.pendingOrders} pending orders and{" "}
                    {wishlist.length} items in your wishlist.
                  </p>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    View Orders
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Total Orders",
                      value: stats.totalOrders,
                      icon: ShoppingBag,
                      color: "bg-blue-500",
                    },
                    {
                      title: "Total Spent",
                      value: `₹${stats.totalSpent.toLocaleString()}`,
                      icon: CreditCard,
                      color: "bg-green-500",
                    },
                    {
                      title: "Wishlist Items",
                      value: wishlist.length,
                      icon: Heart,
                      color: "bg-pink-500",
                    },
                    {
                      title: "Saved Addresses",
                      value: "3",
                      icon: MapPin,
                      color: "bg-purple-500",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold mt-2">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold">
                            ₹{order.total.toLocaleString()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                          <button
                            onClick={() => setActiveTab("orders")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.date)} • {order.items}{" "}
                            item{order.items > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                          <span className="font-bold text-lg">
                            ₹{order.total.toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Items
                          </h4>
                          <div className="space-y-2">
                            {order.itemsDetails.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-700">
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  ₹{item.price.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          {order.status === "delivered" && (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span>Rate Order</span>
                            </button>
                          )}
                          {order.tracking && (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                              <Package className="w-4 h-4" />
                              <span>Track Order</span>
                            </button>
                          )}
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Wishlist
                  </h2>
                  <button
                    onClick={() => setWishlist([])}
                    className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Clear All</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex">
                        <div className="w-32 h-32 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-600">
                                {item.category}
                              </p>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center space-x-1 mb-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {item.rating}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({item.reviews} reviews)
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setWishlist(
                                  wishlist.filter((i) => i.id !== item.id)
                                )
                              }
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                item.inStock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Saved Addresses
                  </h2>
                  <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      type: "Home",
                      name: userData.name,
                      address:
                        userData.address?.street ||
                        "123 Main Street, Andheri West",
                      city: userData.address?.city || "Mumbai",
                      state: userData.address?.state || "Maharashtra",
                      pincode: userData.address?.pincode || "400053",
                      phone: userData.phone,
                      isDefault: true,
                    },
                    {
                      type: "Work",
                      name: userData.name,
                      address: "456 Business Park, Lower Parel",
                      city: "Mumbai",
                      state: "Maharashtra",
                      pincode: "400013",
                      phone: userData.phone,
                      isDefault: false,
                    },
                  ].map((address, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {address.type}
                            </h3>
                            {address.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-600">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-gray-700">
                        <p>{address.address}</p>
                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p>Phone: {address.phone}</p>
                      </div>
                      {!address.isDefault && (
                        <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Settings
                </h2>
                <div className="space-y-6">
                  {/* Profile Info */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Profile Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.name}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={userData.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={userData.phone}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
