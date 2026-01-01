import React, { useState } from "react";
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
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dashboard Stats
  const stats = [
    {
      title: "Total Revenue",
      value: "Rs. 1,245,890",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "1,842",
      change: "+8.2%",
      trend: "up",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: "5,429",
      change: "+15.3%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Products",
      value: "342",
      change: "-2.1%",
      trend: "down",
      icon: <Package className="w-6 h-6" />,
      color: "bg-orange-500",
    },
  ];

  // Recent Orders
  const recentOrders = [
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
  ];

  // Top Products
  const topProducts = [
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
  ];

  // Recent Customers
  const recentCustomers = [
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
  ];

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
                <p className="text-sm text-gray-600">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>

              <button className="relative p-2">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
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
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-600">admin@stylehub.com</p>
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
              342
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
              1,842
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
              5,429
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

          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
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
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
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
                  <p className="text-gray-500">Sales chart will appear here</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button className="text-sm text-gray-600 hover:text-gray-900">
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
                    {recentOrders.map((order, index) => (
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
                        <td className="py-4 text-gray-600">{order.date}</td>
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
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
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
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
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
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
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
                    </div>
                    <div className="ml-4">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
