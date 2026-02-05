import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  PlusCircle,
  Tag,
  X,
  Upload,
  Image as ImageIcon,
  Package,
  FileText,
  DollarSign,
  Ruler,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Size options as a module-level constant to avoid re-creation
const SIZE_OPTIONS = {
  Clothes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  Shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  Accessories: ["42mm", "45mm", "One Size"],
  Bags: ["Small", "Medium", "Large", "Extra Large", "One Size"],
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    salePrice: "",
    description: "",
    onSale: false,
  });

  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Update available sizes when category changes
  useEffect(() => {
    if (formData.category && SIZE_OPTIONS[formData.category]) {
      setAvailableSizes(SIZE_OPTIONS[formData.category]);
      // Clear sizes when category changes
      setSizes([]);
      setSizeQuantities({});
    }
  }, [formData.category]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4));
  }, []);

  const removeImage = useCallback(
    (index) => {
      URL.revokeObjectURL(images[index].preview);
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    [images]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleSizeToggle = useCallback((size) => {
    setSizes((prev) => {
      if (prev.includes(size)) {
        // Remove size and its quantity
        const newSizes = prev.filter((s) => s !== size);
        setSizeQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[size];
          return newQuantities;
        });
        return newSizes;
      } else {
        // Add size with default quantity 0
        setSizeQuantities((prev) => ({
          ...prev,
          [size]: 0,
        }));
        return [...prev, size];
      }
    });
  }, []);

  const handleQuantityChange = useCallback((size, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, numQuantity),
    }));
  }, []);

  const calculateTotalStock = useCallback(() => {
    return Object.values(sizeQuantities).reduce(
      (total, qty) => total + (parseInt(qty) || 0),
      0
    );
  }, [sizeQuantities]);

  const getStockStatus = useCallback((totalStock) => {
    if (totalStock === 0) return "Out of Stock";
    if (totalStock <= 5) return "Low Stock";
    if (totalStock <= 10) return "Limited Stock";
    return "Available";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.category) {
        alert("Please select a category");
        setIsSubmitting(false);
        return;
      }

      if (!formData.name.trim()) {
        alert("Product name is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.price || Number(formData.price) <= 0) {
        alert("Please enter a valid price");
        setIsSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        alert("Product description is required");
        setIsSubmitting(false);
        return;
      }

      if (
        formData.onSale &&
        (!formData.salePrice || Number(formData.salePrice) <= 0)
      ) {
        alert("Sale price is required when product is on sale");
        setIsSubmitting(false);
        return;
      }

      if (
        formData.onSale &&
        Number(formData.salePrice) >= Number(formData.price)
      ) {
        alert("Sale price must be lower than the original price");
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one product image");
        setIsSubmitting(false);
        return;
      }

      if (sizes.length === 0) {
        alert("Please select at least one size");
        setIsSubmitting(false);
        return;
      }

      const totalStock = calculateTotalStock();
      if (totalStock === 0) {
        if (
          !window.confirm(
            "Total stock is 0. Product will be marked as 'Out of Stock'. Continue?"
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare form data
      const form = new FormData();

      // Add images
      images.forEach((img) => form.append("image", img.file));

      // Add text fields
      form.append("category", formData.category);
      form.append("name", formData.name.trim());
      form.append("price", parseFloat(formData.price).toString());
      form.append("description", formData.description.trim());
      form.append("onSale", formData.onSale.toString());

      // Add sizes as JSON string
      const sizesJSON = JSON.stringify(sizes);
      form.append("sizes", sizesJSON);

      // Prepare size quantities object
      const sizeQuantitiesObj = {};
      sizes.forEach((size) => {
        sizeQuantitiesObj[size] = parseInt(sizeQuantities[size] || 0);
      });

      // Add size quantities as JSON string
      const sizeQuantitiesJSON = JSON.stringify(sizeQuantitiesObj);
      form.append("sizeQuantities", sizeQuantitiesJSON);

      // Add sale price if on sale
      if (formData.onSale && formData.salePrice) {
        form.append("salePrice", parseFloat(formData.salePrice).toString());
      }

      // Log for debugging
      console.log("Submitting product data:", {
        category: formData.category,
        name: formData.name,
        price: formData.price,
        description: formData.description,
        onSale: formData.onSale,
        salePrice: formData.salePrice,
        sizes: sizes,
        sizeQuantities: sizeQuantitiesObj,
        totalStock: totalStock,
      });

      // Make API call
      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        body: form,
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Server error response:", responseData);
        throw new Error(
          responseData.message || responseData.error || "Failed to add product"
        );
      }

      console.log("Product added successfully:", responseData);
      alert("Product added successfully!");
      navigate("/adminView");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(
        `Error: ${error.message}\n\nPlease check the console for more details.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total stock for display
  const totalStock = useMemo(
    () => calculateTotalStock(),
    [calculateTotalStock]
  );
  const stockStatus = useMemo(
    () => getStockStatus(totalStock),
    [getStockStatus, totalStock]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Fill in the product details below to add to your store inventory
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-lg font-semibold text-gray-800">
                  <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  Product Images *
                </label>
                <span className="text-sm text-gray-500">
                  {images.length}/4 images
                </span>
              </div>

              {/* Upload Area */}
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                  <Upload className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  Click to upload images
                </p>
                <p className="text-gray-500 text-sm">
                  or drag and drop PNG, JPG, WEBP up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">
                          {img.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4 mr-2 text-gray-500" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                >
                  <option value="" className="text-gray-400">
                    Select Category
                  </option>
                  <option value="Clothes">Clothes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Premium Leather Jacket"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Price (LKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                    Rs
                  </span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Ruler className="w-4 h-4 mr-2 text-gray-500" />
                  Select Sizes * ({sizes.length} selected)
                </label>
                {formData.category ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-[56px]">
                    {availableSizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 border ${
                          sizes.includes(size)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-gray-500">
                      Select a category first to see available sizes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Size Quantities */}
            {sizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <Ruler className="inline w-5 h-5 mr-2 text-indigo-600" />
                    Stock Quantities by Size
                  </h3>
                  <div className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-bold text-indigo-700">
                      {totalStock}
                    </span>{" "}
                    units
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {stockStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className="border border-gray-200 rounded-xl p-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-800">
                          {size}
                        </span>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            (sizeQuantities[size] || 0) > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(sizeQuantities[size] || 0) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              size,
                              (sizeQuantities[size] || 0) - 1
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={sizeQuantities[size] || 0}
                          onChange={(e) =>
                            handleQuantityChange(size, e.target.value)
                          }
                          className="flex-1 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              size,
                              (sizeQuantities[size] || 0) + 1
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500">
                          Available:{" "}
                          <span className="font-medium">
                            {sizeQuantities[size] || 0}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Provide a detailed description of your product..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Sale Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">On Sale</span>
                    <p className="text-sm text-gray-500">
                      Enable special pricing
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                </label>
              </div>

              {/* Sale Price Input */}
              {formData.onSale && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sale Price (LKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                      රු
                    </span>
                    <input
                      type="number"
                      name="salePrice"
                      placeholder="Enter sale price"
                      value={formData.salePrice}
                      onChange={handleChange}
                      required={formData.onSale}
                      min="0"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border border-amber-300 bg-amber-50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                  {formData.price && formData.salePrice && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-sm text-gray-600">
                            Original:{" "}
                          </span>
                          <span className="font-medium text-gray-900">
                            රු
                            {parseFloat(formData.price).toLocaleString("si-LK")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">
                            Discount:{" "}
                          </span>
                          <span className="font-bold text-green-600">
                            {(
                              (1 - formData.salePrice / formData.price) *
                              100
                            ).toFixed(0)}
                            % OFF
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-green-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">You save: </span>
                          <span className="font-bold text-green-700">
                            රු
                            {(
                              formData.price - formData.salePrice
                            ).toLocaleString("si-LK")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={
                  images.length === 0 || sizes.length === 0 || isSubmitting
                }
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <PlusCircle className="inline w-5 h-5 mr-2" />
                    Add Product to Store
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                {images.length === 0
                  ? "Upload at least one image to proceed"
                  : sizes.length === 0
                  ? "Select at least one size to proceed"
                  : isSubmitting
                  ? "Adding product, please wait..."
                  : "Your product will be added to the store immediately"}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
