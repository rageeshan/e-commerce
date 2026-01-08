import express from "express";
import multer from "multer";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../Controllers/productController.js";

const router = express.Router();

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists in your project root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
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
