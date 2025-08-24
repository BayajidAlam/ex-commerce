const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    moreInfo: {
      type: String,
      default: "",
    },
    returnPolicy: {
      type: String,
      default:
        "Returns accepted within 30 days of purchase. Item must be in original condition.",
    },
    exchangePolicy: {
      type: String,
      default:
        "Exchanges accepted within 15 days. Size/color exchanges subject to availability.",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      validUntil: Date,
    },
    category: {
      type: String,
      required: true,
      enum: ["bag", "glass", "jewelry", "watch"],
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: {
        type: String,
        enum: ["cm", "inch"],
        default: "cm",
      },
    },
    colorVariants: [
      {
        colorName: {
          type: String,
          required: true,
        },
        colorCode: String, // Hex color code
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        images: [
          {
            url: String,
            alt: String,
          },
        ],
      },
    ],
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    tags: [String],
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discount.isActive && this.discount.percentage > 0) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Virtual for total stock across all color variants
productSchema.virtual("totalStock").get(function () {
  if (!this.colorVariants || !Array.isArray(this.colorVariants)) {
    return 0;
  }
  return this.colorVariants.reduce(
    (total, variant) => total + (variant.stock || 0),
    0
  );
});

// Virtual for inStock status
productSchema.virtual("inStock").get(function () {
  if (!this.colorVariants || !Array.isArray(this.colorVariants)) {
    return false;
  }
  const totalStock = this.colorVariants.reduce(
    (total, variant) => total + (variant.stock || 0),
    0
  );
  return totalStock > 0;
});

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Index for better search performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "discount.isActive": 1 });

module.exports = mongoose.model("Product", productSchema);
