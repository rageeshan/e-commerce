import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Config/email.js";

export async function getAllUsers(req, res) {
  try {
    const user = await User.find().sort({ createdAt: -1 }); //shows the newest note on first
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAllUser" + error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function getById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found! " });
    res.json(user);
  } catch (error) {
    console.error("Error in getById" + error);
    res
      .status(500)
      .json({ message: "Somethings wrong! check the code please!" });
  }
}

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      nic,
      mobile,
      address,
      gender,
      dob,
      email,
      password,
    } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      firstName,
      lastName,
      nic,
      mobile,
      address,
      gender,
      dob,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    const savedUser = await user.save();
    
    // Send OTP via email
    await sendOTP(email, otp);

    res.status(201).json({
      message: "User registered. Please check email for OTP.",
      userId: savedUser._id,
      email: savedUser.email
    });
  } catch (error) {
    console.error("Error in createUser:", error.message); // log real error
    res
      .status(500)
      .json({ message: "User could not be added!", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error.message);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body; // Only update fields provided in request

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // ✅ return updated doc & validate
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res
      .status(500)
      .json({ message: "User didn't update!", error: error.message });
  }
};

export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 Emergency hardcoded admin
    if (email === "admin@gmail.com" && password === "RAGEESHAN2003@") {
      return res.status(200).json({
        token: "admin-token-123",
        role: "admin",
        message: "Admin login successful",
        user: {
          id: "admin001",
          name: "Admin User",
          email: "admin@gmail.com",
          phone: "+91 99999 99999",
          role: "admin",
          joinDate: new Date().toISOString(),
          address: {
            street: "Admin Street",
            city: "Admin City",
            state: "Admin State",
            pincode: "000000",
            country: "India",
          },
        },
      });
    }

    // 🔍 Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email address first",
      });
    }

    // Compare with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate a simple token (in production, use JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret_key", {
      expiresIn: "30d",
    });

    return res.status(200).json({
      token: token,
      role: "admin",
      message: "Login successful",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.mobile,
        address: user.address,
        joinDate: user.createdAt,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetOtp = resetOtp;
    user.resetOtpExpires = resetOtpExpires;
    await user.save();

    await sendOTP(email, resetOtp); // Reusing sendOTP for reset

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Auth middleware attaches req.user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
