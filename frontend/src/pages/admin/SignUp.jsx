import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    mobile: "",
    address: "",
    gender: "",
    dob: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // NIC validation
    if (!formData.nic.trim()) {
      newErrors.nic = "NIC is required";
    } else if (!/^([0-9]{9}[VXvx]|[0-9]{12})$/.test(formData.nic.trim())) {
      newErrors.nic = "Invalid NIC format";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^0[0-9]{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit number";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Date validation
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = "Date must be in the past";
      }
    }

    return newErrors;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/user",
        formData
      );

      // Move to OTP step
      setRegisteredEmail(formData.email);
      setStep(2);
      toast.success(response.data.message || "Account created successfully. Please check email for OTP.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5001/api/user/verify-otp", {
        email: registeredEmail,
        otp,
      });

      toast.success(response.data.message || "Account verified successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Clothing Store
          </h1>
          <p className="text-gray-600 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {step === 1 ? (
            <>
              <h2 className="text-lg font-medium text-gray-800 mb-6">Sign Up</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                      errors.nic ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="123456789V"
                  />
                  {errors.nic && (
                    <p className="text-red-500 text-xs mt-1">{errors.nic}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                      errors.mobile ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0712345678"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="123 Main Street"
                  />
                </div>

                {/* Gender + DOB */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                        errors.dob ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 pr-10 border rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 rounded font-medium text-sm ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-gray-800 font-medium hover:text-gray-900 cursor-pointer hover:underline"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-gray-800 mb-2">Verify Your Email</h2>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a 6-digit OTP to <strong>{registeredEmail}</strong>.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-center text-2xl tracking-widest"
                    placeholder="------"
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
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Back to Registration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
