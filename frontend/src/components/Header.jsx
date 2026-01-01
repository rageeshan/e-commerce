import React, { useState } from "react";
import { Search, ShoppingBag, ShoppingCart, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Clothes", href: "/clothes" },
    { name: "Accessories", href: "/accessories" },
    { name: "Shoes", href: "/shoes" },
    { name: "Bags", href: "/bags" },
    { name: "Sale", href: "/sale" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu if open
    // No navigation needed - search happens in place
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">STYLEHUB</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                onKeyPress={handleKeyPress}
                placeholder="Search products..."
                className="ml-2 bg-transparent outline-none text-sm w-48"
              />
            </form>

            {/* Search Icon for Mobile */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Cart */}
            <button className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Account */}
            <button
              className="p-2"
              onClick={() => navigate("/signup")}
              title="Sign Up / Log In"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 font-medium py-2 text-left"
              >
                Sign Up / Log In
              </button>
            </div>

            {/* Mobile Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-4 flex items-center bg-gray-50 rounded-lg px-4 py-3"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                onKeyPress={handleKeyPress}
                placeholder="Search products..."
                className="ml-2 bg-transparent outline-none text-sm flex-1"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
