import Product from "../Models/productModel.js";

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
  } catch (error) {
    console.error("Error in createProduct", error);
    res.status(500).json({ message: "Product was not added!" });
  }
}

export async function updateProduct(req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found!" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct", error);
    res.status(500).json({ message: "Product was not updated!" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found!" });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteProduct", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
