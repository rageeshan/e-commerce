import { useState, useRef } from "react";
import {
  PlusCircle,
  Tag,
  X,
  Upload,
  Image as ImageIcon,
  Package,
  FileText,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// const navigate = useNavigate;

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    salePrice: "",
    description: "",
    stockStatus: "",
    onSale: false,
  });

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.onSale &&
      Number(formData.salePrice) >= Number(formData.price)
    ) {
      alert("Sale price must be lower than the original price");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    try {
      const form = new FormData();

      images.forEach((img) => form.append("image", img.file));

      form.append("category", formData.category);
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("stockStatus", formData.stockStatus);
      form.append("onSale", formData.onSale);

      if (formData.onSale) form.append("salePrice", formData.salePrice);

      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to add product");

      await res.json();
      alert("Product added successfully!");
      navigate("/adminView");

      // // Reset form
      // setFormData({
      //   category: "",
      //   name: "",
      //   price: "",
      //   salePrice: "",
      //   description: "",
      //   stockStatus: "",
      //   onSale: false,
      // });
      // setImages([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding the product!");
    }
  };

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
                  Product Images
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
                  Category
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
                  Product Name
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
                  Price (LKR)
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

              {/* Stock Status */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Package className="w-4 h-4 mr-2 text-gray-500" />
                  Stock Status
                </label>
                <select
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                >
                  <option value="" className="text-gray-400">
                    Select Stock Status
                  </option>
                  <option value="Available" className="text-green-700">
                    Available
                  </option>
                  <option value="Out of Stock" className="text-red-700">
                    Out of Stock
                  </option>
                  <option value="Limited Stock" className="text-amber-700">
                    Limited Stock
                  </option>
                  <option value="Low Stock" className="text-orange-700">
                    Low Stock
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                Description
              </label>
              <textarea
                name="description"
                placeholder="Provide a detailed description of your product..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
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
                    Sale Price (LKR)
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
                      required
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
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={images.length === 0}
              >
                <PlusCircle className="inline w-5 h-5 mr-2" />
                Add Product to Store
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                {images.length === 0
                  ? "Upload at least one image to proceed"
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
