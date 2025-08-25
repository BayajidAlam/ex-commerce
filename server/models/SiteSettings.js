const mongoose = require("mongoose");

// Site Settings Schema
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: "ARJO",
    },
    logoUrl: {
      type: String,
      default: null,
    },
    faviconUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "Premium E-commerce Store",
    },
    contactEmail: {
      type: String,
      default: "contact@arjo.com",
    },
    contactPhone: {
      type: String,
      default: "+1234567890",
    },
    address: {
      type: String,
      default: "123 Main Street, City, Country",
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    seoSettings: {
      metaTitle: { type: String, default: "ARJO - Premium E-commerce" },
      metaDescription: {
        type: String,
        default: "Discover premium products at ARJO",
      },
      keywords: {
        type: String,
        default: "ecommerce, premium, fashion, accessories",
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Banner Slider Schema
const bannerSliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    buttonText: {
      type: String,
      default: "Shop Now",
    },
    buttonLink: {
      type: String,
      default: "/products",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bannerSliderSchema.index({ order: 1, isActive: 1 });
bannerSliderSchema.index({ createdAt: -1 });

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
const BannerSlider = mongoose.model("BannerSlider", bannerSliderSchema);

module.exports = { SiteSettings, BannerSlider };
