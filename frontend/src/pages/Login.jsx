import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setIsSubmitting(false);
        return;
      }

      // Store token and user data
      localStorage.setItem("token", data.token);

      // Ensure we have complete user data
      const userData = {
        ...data.user,
        avatar:
          data.user.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${
            data.user.name || data.user.email
          }`,
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          pendingOrders: 0,
          completedOrders: 0,
        },
      };

      localStorage.setItem("user", JSON.stringify(userData));

      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "user") {
        navigate("/user");
      } else {
        setError("Unauthorized access");
      }
    } catch {
      setError("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">
            Log in to your StyleHub account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded font-medium text-sm ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900 text-white"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-800 font-medium hover:text-gray-900 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
