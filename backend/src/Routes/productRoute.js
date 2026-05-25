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

/* ─────────────────────────────────────────────
   Multer — memory storage so the controller can
   try Cloudinary first, then fall back to disk.
   ───────────────────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, or WebP images are allowed"));
  },
});

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Accept up to 4 images under field "image".
// Wrap multer so errors (wrong type, too large) are forwarded as JSON via
// the global error handler instead of Express's default HTML error page.
router.post("/", (req, res, next) => {
  upload.array("image", 4)(req, res, (err) => {
    if (err) {
      // Multer error — return JSON
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
}, createProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
