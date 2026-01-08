import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../Controllers/productController.js";

const router = express.Router();

// ---------------- Multer Setup ----------------
// In productRoute.js - Update the filename function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Update the filename function in Multer configuration
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const ext = path.extname(originalName); // Get extension (.jpg, .png, etc)

    // Generate a simple, short filename
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const cleanFilename = `${timestamp}-${random}${ext}`;

    console.log(`📸 Original: ${originalName} → Saved as: ${cleanFilename}`);
    cb(null, cleanFilename);
  },
});

const upload = multer({ storage });
// ---------------------------------------------

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Accept up to 4 images under field "image"
router.post("/", upload.array("image", 4), createProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
