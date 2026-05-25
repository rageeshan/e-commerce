import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setIsForgotSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      toast.success("OTP sent to your email!");
      setForgotStep(2);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp || !newPassword) return;

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsForgotSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully! You can now log in.");
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsForgotSubmitting(false);
    }
  };

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
      } else {
        setError("Unauthorized access. Admin only.");
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-700">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)} 
                  className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotOtp("");
                setNewPassword("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">Reset Password</h2>
            <p className="text-gray-600 text-sm mb-6">
              {forgotStep === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
            </p>

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className={`w-full py-2.5 rounded font-medium text-sm ${
                    isForgotSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {isForgotSubmitting ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-center text-2xl tracking-widest"
                    placeholder="------"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className={`w-full py-2.5 rounded font-medium text-sm ${
                    isForgotSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {isForgotSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
