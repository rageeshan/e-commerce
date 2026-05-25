import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  PieChart,
  Layers,
  Tag,
  Truck,
  MessageSquare,
  Star,
  Shield,
  Settings,
  Home,
  ChevronDown,
  Bell,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(5);

  // Dashboard Stats - Dynamic data
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "Rs. 0",
      change: "+0%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Products",
      value: "0",
      change: "-0%",
      trend: "down",
      icon: <Package className="w-6 h-6" />,
      color: "bg-orange-500",
    },
  ]);

  // Recent Orders
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "#ORD001",
      customer: "John Doe",
      date: "2024-01-15",
      amount: "Rs. 12,999",
      status: "delivered",
      payment: "Paid",
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      date: "2024-01-15",
      amount: "Rs. 8,499",
      status: "processing",
      payment: "Paid",
    },
    {
      id: "#ORD003",
      customer: "Robert Johnson",
      date: "2024-01-14",
      amount: "Rs. 23,499",
      status: "shipped",
      payment: "Pending",
    },
    {
      id: "#ORD004",
      customer: "Sarah Wilson",
      date: "2024-01-14",
      amount: "Rs. 5,299",
      status: "delivered",
      payment: "Paid",
    },
    {
      id: "#ORD005",
      customer: "Michael Brown",
      date: "2024-01-13",
      amount: "Rs. 15,799",
      status: "cancelled",
      payment: "Refunded",
    },
  ]);

  // Top Products
  const [topProducts, setTopProducts] = useState([
    {
      name: "Classic White T-Shirt",
      category: "Clothes",
      sales: 342,
      revenue: "Rs. 1,024,158",
      stock: 45,
    },
    {
      name: "Denim Jacket",
      category: "Clothes",
      sales: 189,
      revenue: "Rs. 1,701,111",
      stock: 12,
    },
    {
      name: "Running Shoes",
      category: "Shoes",
      sales: 156,
      revenue: "Rs. 2,027,844",
      stock: 8,
    },
    {
      name: "Leather Handbag",
      category: "Bags",
      sales: 89,
      revenue: "Rs. 1,334,911",
      stock: 5,
    },
    {
      name: "Silk Scarf",
      category: "Accessories",
      sales: 267,
      revenue: "Rs. 666,633",
      stock: 67,
    },
  ]);

  // Recent Customers
  const [recentCustomers, setRecentCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+94 77 123 4567",
      orders: 12,
      totalSpent: "Rs. 89,950",
      joined: "2024-01-10",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+94 71 234 5678",
      orders: 8,
      totalSpent: "Rs. 67,992",
      joined: "2024-01-12",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+94 76 345 6789",
      orders: 5,
      totalSpent: "Rs. 117,495",
      joined: "2024-01-08",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+94 75 456 7890",
      orders: 3,
      totalSpent: "Rs. 15,897",
      joined: "2024-01-14",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+94 78 567 8901",
      orders: 1,
      totalSpent: "Rs. 15,799",
      joined: "2024-01-13",
    },
  ]);

  // Update dashboard stats with dynamic data - useCallback to memoize
  const updateDashboardStats = useCallback(() => {
    // Calculate totals
    const totalRevenue = recentOrders.reduce((sum, order) => {
      // Extract numeric value from amount string
      const amountMatch = order.amount.match(/\d+/g);
      const amount = amountMatch ? parseInt(amountMatch.join("")) : 0;
      return sum + amount;
    }, 0);

    const totalOrders = recentOrders.length;
    const totalCustomers = recentCustomers.length;
    const totalProducts = topProducts.length;

    // Update stats
    setStats([
      {
        title: "Total Revenue",
        value: `Rs. ${totalRevenue.toLocaleString()}`,
        change: "+12.5%",
        trend: "up",
        icon: <DollarSign className="w-6 h-6" />,
        color: "bg-green-500",
      },
      {
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: "+8.2%",
        trend: "up",
        icon: <ShoppingBag className="w-6 h-6" />,
        color: "bg-blue-500",
      },
      {
        title: "Customers",
        value: totalCustomers.toLocaleString(),
        change: "+15.3%",
        trend: "up",
        icon: <Users className="w-6 h-6" />,
        color: "bg-purple-500",
      },
      {
        title: "Products",
        value: totalProducts.toLocaleString(),
        change: "-2.1%",
        trend: "down",
        icon: <Package className="w-6 h-6" />,
        color: "bg-orange-500",
      },
    ]);
  }, [recentOrders, recentCustomers, topProducts]);

  // Fetch admin data from localStorage and initialize stats
  useEffect(() => {
    const fetchAdminData = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!savedUser || !token) {
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        // Verify it's actually an admin
        if (parsedUser.role !== "admin") {
          navigate("/login");
          return;
        }

        // Set admin data with proper defaults
        setAdminData({
          ...parsedUser,
          name: parsedUser.name || "Admin User",
          email: parsedUser.email || "admin@stylehub.com",
          phone: parsedUser.phone || "+94 77 123 4567",
          avatar:
            parsedUser.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
              parsedUser.name || "Admin"
            }`,
          joinDate:
            parsedUser.joinDate || new Date().toISOString().split("T")[0],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        navigate("/login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Initialize stats after admin data is loaded
  useEffect(() => {
    if (!loading && adminData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateDashboardStats();
    }
  }, [loading, adminData, updateDashboardStats]);

  // Update stats when data changes
  useEffect(() => {
    if (adminData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateDashboardStats();
    }
  }, [
    recentOrders,
    recentCustomers,
    topProducts,
    adminData,
    updateDashboardStats,
  ]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Handle order actions
  const handleOrderAction = (orderId, action) => {
    console.log(`${action} order ${orderId}`);
    // Add your order action logic here
    switch (action) {
      case "view":
        // Navigate to order details
        break;
      case "edit":
        // Edit order
        break;
      case "delete":
        // Delete order
        setRecentOrders((prev) => prev.filter((order) => order.id !== orderId));
        break;
    }
  };

  // Handle product actions
  const handleProductAction = (productName, action) => {
    console.log(`${action} product ${productName}`);
    // Add your product action logic here
    switch (action) {
      case "edit":
        // Edit product
        break;
      case "delete":
        // Delete product
        setTopProducts((prev) =>
          prev.filter((product) => product.name !== productName)
        );
        break;
      case "restock":
        // Restock product
        break;
    }
  };

  // Handle customer actions
  const handleCustomerAction = (customerId, action) => {
    console.log(`${action} customer ${customerId}`);
    // Add your customer action logic here
    switch (action) {
      case "view":
        // View customer details
        break;
      case "edit":
        // Edit customer
        break;
      case "delete":
        // Delete customer
        setRecentCustomers((prev) =>
          prev.filter((customer) => customer.id !== customerId)
        );
        break;
    }
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotificationCount(0);
  };

  // Format date - FIXED: Added error handling
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Filter orders based on search term
  const filteredOrders = recentOrders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter customers based on search term
  const filteredCustomers = recentCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter products based on search term
  const filteredProducts = topProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // No admin data state
  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Access denied. Please log in as admin.
          </p>
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
      {/* Top Navigation */}
      <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {adminData.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>

              <button
                className="relative p-2"
                onClick={handleClearNotifications}
              >
                {notificationCount > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
                )}
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={adminData.avatar}
                    alt={adminData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {adminData.name}
                  </p>
                  <p className="text-xs text-gray-600">{adminData.email}</p>
                </div>
                {/* Dropdown Menu */}
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button 
                        onClick={() => setActiveTab("settings")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-30 h-screen pt-8 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 w-64`}
      >
        <nav className="px-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "overview"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "products"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Package className="w-5 h-5 mr-3" />
            Products
            <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
              {stats[3].value}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "orders"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Orders
            <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
              {stats[1].value}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "customers"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Customers
            <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
              {stats[2].value}
            </span>
          </button>

          <div className="pt-8 pb-4">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Analytics
            </p>
          </div>

          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
            <TrendingUp className="w-5 h-5 mr-3" />
            Reports
          </button>

          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
            <Calendar className="w-5 h-5 mr-3" />
            Calendar
          </button>

          <div className="pt-8 pb-4">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </p>
          </div>

          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "settings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>

          {/* Admin Info Section */}
          <div className="pt-8 mt-8 border-t border-gray-200 px-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={adminData.avatar}
                  alt={adminData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {adminData.name}
                </p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              {adminData.phone && (
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-2" />
                  <span>{adminData.phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-2" />
                <span>{adminData.email}</span>
              </div>
              {adminData.joinDate && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-2" />
                  <span>Joined {formatDate(adminData.joinDate)}</span>
                </div>
              )}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">
          {activeTab === "settings" ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const currentPassword = e.target.currentPassword.value;
                    const newPassword = e.target.newPassword.value;
                    
                    if (newPassword.length < 6) {
                      toast.error("New password must be at least 6 characters");
                      return;
                    }

                    try {
                      const res = await fetch("http://localhost:5001/api/user/change-password", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ currentPassword, newPassword })
                      });
                      
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || "Failed to change password");
                      
                      toast.success("Password updated successfully! Please log in again.");
                      e.target.reset();
                      handleLogout();
                    } catch (error) {
                      toast.error(error.message);
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                    <input
                      name="currentPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">New Password</label>
                    <input
                      name="newPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded font-medium text-sm transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
          {/* Admin Welcome Banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {adminData.name.split(" ")[0]}!
                  </h2>
                  <p className="text-gray-300 mb-4">
                    You have{" "}
                    {
                      recentOrders.filter((o) => o.status === "processing")
                        .length
                    }{" "}
                    pending orders and {notificationCount} notifications.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Administrator</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{adminData.email}</span>
                    </div>
                    {adminData.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{adminData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={adminData.avatar}
                    alt={adminData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales Overview
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    This Week
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    This Month
                  </button>
                </div>
              </div>
              {/* Placeholder for Chart */}
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Total Revenue: {stats[0].value}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {recentOrders.length} orders this month
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4">
                          <span className="font-medium text-gray-900">
                            {order.id}
                          </span>
                        </td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4 text-gray-600">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-4 font-medium">{order.amount}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "view")
                                }
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "edit")
                                }
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "delete")
                                }
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Products and Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Products
                </h2>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>

              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {product.revenue}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} sales
                      </p>
                    </div>
                    <div className="ml-4">
                      {product.stock > 20 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          In Stock ({product.stock})
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            handleProductAction(product.name, "edit")
                          }
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleProductAction(product.name, "delete")
                          }
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Customers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Customers
                </h2>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Customer
                </button>
              </div>

              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {customer.name}
                      </h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {customer.totalSpent}
                      </p>
                      <p className="text-sm text-gray-600">
                        {customer.orders} orders
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined {formatDate(customer.joined)}
                      </p>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          handleCustomerAction(customer.id, "view")
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Total Visitors</h3>
              <p className="text-3xl font-bold mb-4">24,589</p>
              <p className="text-blue-100">+18.2% from last week</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold mb-4">3.2%</p>
              <p className="text-purple-100">+0.8% from last month</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">
                Average Order Value
              </h3>
              <p className="text-3xl font-bold mb-4">Rs. 6,789</p>
              <p className="text-green-100">+Rs. 542 from last month</p>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
