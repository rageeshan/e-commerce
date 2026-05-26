import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Calendar, Eye, EyeOff, ShieldCheck, ArrowLeft, ShoppingBag } from "lucide-react";

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
        `${import.meta.env.VITE_API_BASE_URL}/user`,
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/verify-otp`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 px-4 py-8 relative overflow-hidden">
      {/* Decorative Blob lights */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>
      <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-md mb-3 text-white">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            StyleHub
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            Create a new admin account
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-8">
          {step === 1 ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* NIC + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">NIC Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm ${
                          errors.nic ? "border-red-500 focus:ring-red-500" : "border-slate-200"
                        }`}
                        placeholder="123456789V"
                      />
                    </div>
                    {errors.nic && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.nic}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm ${
                          errors.mobile ? "border-red-500 focus:ring-red-500" : "border-slate-200"
                        }`}
                        placeholder="0712345678"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Gender + DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 text-sm"
                    >
                      <option value="" className="text-slate-400">Select Gender</option>
                      <option value="Male" className="text-slate-850 bg-white">Male</option>
                      <option value="Female" className="text-slate-850 bg-white">Female</option>
                      <option value="Other" className="text-slate-850 bg-white">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 text-sm ${
                          errors.dob ? "border-red-500 focus:ring-red-500" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.dob}</p>
                    )}
                  </div>
                </div>

                {/* Email + Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm ${
                          errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200"
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm ${
                          errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-200"
                        }`}
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="2"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 text-sm resize-none"
                      placeholder="123 Main Street, City"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer hover:underline transition-all"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                Verify Your Email
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                We've sent a 6-digit OTP to <strong className="text-indigo-600">{registeredEmail}</strong>.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest text-slate-800 focus:outline-none"
                    placeholder="------"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
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
