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
      onSale,
      salePrice,
      sizes,
      sizeQuantities,
    } = req.body;

    // Parse sizes
    let parsedSizes = [];
    if (sizes) {
      if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch {
          parsedSizes = sizes.split(",").map((s) => s.trim());
        }
      }
    }

    // Parse size quantities
    let parsedSizeQuantities = {};
    if (sizeQuantities) {
      if (typeof sizeQuantities === "string") {
        try {
          parsedSizeQuantities = JSON.parse(sizeQuantities);
        } catch (error) {
          return res.status(400).json({
            message: "Invalid size quantities format. Should be JSON object",
          });
        }
      } else {
        parsedSizeQuantities = sizeQuantities;
      }
    }

    // Initialize sizeAvailability as plain object
    const sizeAvailability = {};
    if (parsedSizes.length > 0) {
      parsedSizes.forEach((size) => {
        const quantity = parseInt(parsedSizeQuantities[size] || 0) || 0;
        sizeAvailability[size] = {
          quantity,
          available: quantity > 0,
        };
      });
    }

    // Parse onSale as boolean
    const isOnSale = onSale === "true" || onSale === true;

    // Parse salePrice only if onSale is true and salePrice exists
    let parsedSalePrice;
    if (isOnSale && salePrice && salePrice.trim() !== "") {
      parsedSalePrice = parseFloat(salePrice);
      if (isNaN(parsedSalePrice) || parsedSalePrice <= 0) {
        return res.status(400).json({
          message: "Valid sale price is required when product is on sale",
        });
      }
    }

    // Parse regular price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    // Validate sale price is lower than regular price
    if (isOnSale && parsedSalePrice && parsedSalePrice >= parsedPrice) {
      return res.status(400).json({
        message: "Sale price must be lower than the original price",
      });
    }

    // Create product data object
    const productData = {
      category,
      image: images,
      name,
      price: parsedPrice,
      description,
      sizes: parsedSizes,
      sizeAvailability,
      onSale: isOnSale,
    };

    // Only add salePrice if onSale is true and it's a valid number
    if (isOnSale && parsedSalePrice) {
      productData.salePrice = parsedSalePrice;
    }
    // If not on sale, explicitly don't include salePrice in the data
    // This will let Mongoose use the default value (undefined) from the schema

    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    res.status(500).json({
      message: "Product was not added!",
      error: error.message,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const {
      category,
      name,
      price,
      description,
      onSale,
      salePrice,
      sizes,
      sizeQuantities,
    } = req.body;

    // Get existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    // Parse onSale as boolean
    const isOnSale = onSale === "true" || onSale === true;

    // Parse salePrice only if onSale is true and salePrice exists
    let parsedSalePrice;
    if (isOnSale && salePrice && salePrice.trim() !== "") {
      parsedSalePrice = parseFloat(salePrice);
      if (isNaN(parsedSalePrice) || parsedSalePrice <= 0) {
        return res.status(400).json({
          message: "Valid sale price is required when product is on sale",
        });
      }
    }

    // Parse regular price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    // Validate sale price is lower than regular price
    if (isOnSale && parsedSalePrice && parsedSalePrice >= parsedPrice) {
      return res.status(400).json({
        message: "Sale price must be lower than the original price",
      });
    }

    // Parse sizes if provided
    let parsedSizes = existingProduct.sizes;
    if (sizes) {
      if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch {
          parsedSizes = sizes.split(",").map((s) => s.trim());
        }
      }
    }

    // Parse size quantities if provided
    const updatedSizeAvailability = { ...existingProduct.sizeAvailability };
    if (sizeQuantities) {
      let parsedSizeQuantities = {};
      if (typeof sizeQuantities === "string") {
        try {
          parsedSizeQuantities = JSON.parse(sizeQuantities);
        } catch (error) {
          return res.status(400).json({
            message: "Invalid size quantities format. Should be JSON object",
          });
        }
      } else {
        parsedSizeQuantities = sizeQuantities;
      }

      // Update quantities for existing sizes
      for (const size in updatedSizeAvailability) {
        if (parsedSizeQuantities[size] !== undefined) {
          const quantity = parseInt(parsedSizeQuantities[size]) || 0;
          updatedSizeAvailability[size] = {
            quantity: Math.max(0, quantity),
            available: quantity > 0,
          };
        }
      }

      // Add quantities for new sizes
      parsedSizes.forEach((size) => {
        if (
          !updatedSizeAvailability[size] &&
          parsedSizeQuantities[size] !== undefined
        ) {
          const quantity = parseInt(parsedSizeQuantities[size]) || 0;
          updatedSizeAvailability[size] = {
            quantity,
            available: quantity > 0,
          };
        }
      });
    }

    // Prepare update fields
    const updatedFields = {
      category,
      name,
      price: parsedPrice,
      description,
      onSale: isOnSale,
      sizes: parsedSizes,
      sizeAvailability: updatedSizeAvailability,
    };

    // Only set salePrice if onSale is true and we have a valid sale price
    if (isOnSale && parsedSalePrice) {
      updatedFields.salePrice = parsedSalePrice;
    } else {
      // If not on sale, explicitly set to undefined to clear it
      updatedFields.salePrice = undefined;
    }

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
    res.status(500).json({
      message: "Product was not updated!",
      error: error.message,
    });
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

// New controller: Update stock for a specific size
export async function updateSizeStock(req, res) {
  try {
    const { id } = req.params;
    const { size, quantity } = req.body;

    if (!size || quantity === undefined) {
      return res.status(400).json({
        message: "Size and quantity are required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const updatedProduct = await product.updateSizeStock(
      size,
      parseInt(quantity)
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateSizeStock:", error);
    res.status(500).json({
      message: "Failed to update stock",
      error: error.message,
    });
  }
}

// New controller: Add a new size to product
export async function addSizeToProduct(req, res) {
  try {
    const { id } = req.params;
    const { size, initialQuantity } = req.body;

    if (!size) {
      return res.status(400).json({
        message: "Size is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const updatedProduct = await product.addSize(
      size,
      parseInt(initialQuantity || 0)
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in addSizeToProduct:", error);
    res.status(500).json({
      message: "Failed to add size",
      error: error.message,
    });
  }
}

// New controller: Get products by category with size filtering
export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const { size, inStock } = req.query;

    let query = { category };

    // Filter by size if provided
    if (size) {
      query.sizes = size;
    }

    // Filter by stock status if provided
    if (inStock === "true") {
      query.stockStatus = { $ne: "Out of Stock" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductsByCategory", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

// New controller: Get products on sale
export async function getProductsOnSale(req, res) {
  try {
    const products = await Product.find({
      onSale: true,
      stockStatus: { $ne: "Out of Stock" },
    }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductsOnSale", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

// New controller: Search products
export async function searchProducts(req, res) {
  try {
    const { query, category, minPrice, maxPrice } = req.query;

    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(searchQuery).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchProducts", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
