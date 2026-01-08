import Product from "../Models/productModel.js";
import path from "path";
import fs from "fs/promises";

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found!" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function createProduct(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const images = req.files.map((file) => file.filename);

    const {
      category,
      name,
      price,
      description,
      stockStatus,
      onSale,
      salePrice,
    } = req.body;

    const product = new Product({
      category,
      image: images, // save array of filenames
      name,
      price,
      description,
      stockStatus,
      onSale: onSale === "true" || onSale === true,
      salePrice: onSale ? salePrice : null,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

    console.log("Uploaded files:", req.files);
    console.log("Image filenames:", images);
  } catch (error) {
    console.error("Error in createProduct", error);
    res.status(500).json({ message: "Product was not added!" });
  }
}

// Update product
// Update product
export async function updateProduct(req, res) {
  try {
    const {
      category,
      name,
      price,
      description,
      stockStatus,
      onSale,
      salePrice,
    } = req.body;

    // Validation: onSale requires salePrice < price
    if (onSale && (!salePrice || Number(salePrice) >= Number(price))) {
      return res.status(400).json({
        message:
          "Sale price is required and must be lower than the original price",
      });
    }

    const updatedFields = {
      category,
      name,
      price,
      description,
      stockStatus,
      onSale,
    };

    if (onSale) updatedFields.salePrice = salePrice;
    else updatedFields.salePrice = undefined; // clear salePrice if not on sale

    // Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found!" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Product was not updated!" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found!" });

    // Delete associated images
    if (deletedProduct.image && deletedProduct.image.length > 0) {
      for (const filename of deletedProduct.image) {
        try {
          const filePath = path.join(process.cwd(), "uploads", filename);
          await fs.unlink(filePath);
          console.log(`Deleted file: ${filename}`);
        } catch (err) {
          console.error(`Failed to delete file: ${filename}`, err.message);
        }
      }
    }

    res
      .status(200)
      .json({ message: "Product and images deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteProduct", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
