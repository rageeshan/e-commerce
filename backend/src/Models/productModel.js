import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Accessories", "Clothes", "Shoes", "Bags"],
    },

    image: {
      type: [String], // array of image filenames
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    stockStatus: {
      type: String,
      required: true,
      enum: ["Available", "Out of Stock", "Limited Stock", "Low Stock"],
    },

    onSale: {
      type: Boolean,
      default: false,
    },

    salePrice: {
      type: Number,
      required: function () {
        return this.onSale === true;
      },
      validate: {
        validator: function (value) {
          if (this.onSale) {
            return value < this.price;
          }
          return true;
        },
        message: "Sale price must be lower than original price",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
