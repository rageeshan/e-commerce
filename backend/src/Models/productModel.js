import mongoose from "mongoose";

const SIZE_OPTIONS = {
  Clothes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  Shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  Accessories: ["42mm", "45mm", "One Size"],
  Bags: ["Small", "Medium", "Large", "Extra Large", "One Size"],
};

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: Object.keys(SIZE_OPTIONS),
    },

    image: {
      type: [String],
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
      enum: ["Available", "Out of Stock", "Limited Stock", "Low Stock"],
      default: "Out of Stock",
    },

    onSale: {
      type: Boolean,
      default: false,
    },

    salePrice: {
      type: Number,
      required() {
        return this.onSale;
      },
      validate: {
        validator(value) {
          return !this.onSale || value < this.price;
        },
        message: "Sale price must be lower than original price",
      },
    },

    sizes: {
      type: [String],
      required: true,
      validate: {
        validator(value) {
          return value.every((size) =>
            SIZE_OPTIONS[this.category].includes(size)
          );
        },
        message() {
          return `Invalid size for ${
            this.category
          }. Allowed sizes: ${SIZE_OPTIONS[this.category].join(", ")}`;
        },
      },
    },

    sizeAvailability: {
      type: Object,
      default: {},
    },

    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/* ---------------- STOCK CALCULATION ---------------- */

function calculateStockStatus(total) {
  if (total === 0) return "Out of Stock";
  if (total <= 5) return "Low Stock";
  if (total <= 10) return "Limited Stock";
  return "Available";
}

/* ---------------- PRE SAVE (NO NEXT) ---------------- */

productSchema.pre("save", function () {
  // Initialize sizeAvailability on first save
  if (this.isNew && this.sizes?.length) {
    if (
      !this.sizeAvailability ||
      Object.keys(this.sizeAvailability).length === 0
    ) {
      this.sizeAvailability = {};
      this.sizes.forEach((size) => {
        this.sizeAvailability[size] = {
          quantity: 0,
          available: false,
        };
      });
    }
  }

  // Recalculate stock
  let total = 0;
  for (const size in this.sizeAvailability) {
    const qty = Number(this.sizeAvailability[size]?.quantity) || 0;
    this.sizeAvailability[size].available = qty > 0;
    total += qty;
  }

  this.totalStock = total;
  this.stockStatus = calculateStockStatus(total);
});

/* ---------------- INSTANCE METHODS ---------------- */

productSchema.methods.updateSizeStock = async function (size, quantity) {
  if (!this.sizeAvailability[size]) {
    throw new Error(`Size ${size} not available`);
  }

  this.sizeAvailability[size].quantity = Math.max(0, quantity);
  this.sizeAvailability[size].available = quantity > 0;

  return this.save();
};

productSchema.methods.addSize = async function (size, initialQuantity = 0) {
  if (!SIZE_OPTIONS[this.category].includes(size)) {
    throw new Error(`Invalid size ${size} for ${this.category}`);
  }

  if (!this.sizes.includes(size)) {
    this.sizes.push(size);
  }

  this.sizeAvailability[size] = {
    quantity: Math.max(0, initialQuantity),
    available: initialQuantity > 0,
  };

  return this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
