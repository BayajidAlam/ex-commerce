const express = require("express");
const { SiteSettings, BannerSlider } = require("../models/SiteSettings");

const router = express.Router();

// GET /api/site-settings - Get public site settings
router.get("/site-settings", async (req, res) => {
  try {
    let siteSettings = await SiteSettings.findOne().select(
      "-updatedBy -createdAt -updatedAt -__v"
    );

    // If no settings exist, return default ones
    if (!siteSettings) {
      siteSettings = {
        siteName: "ARJO",
        logoUrl: null,
        faviconUrl: null,
        description: "Premium E-commerce Store",
        contactEmail: "contact@arjo.com",
        contactPhone: "+1234567890",
        address: "123 Main Street, City, Country",
        socialMedia: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        seoSettings: {
          metaTitle: "ARJO - Premium E-commerce",
          metaDescription: "Discover premium products at ARJO",
          keywords: "ecommerce, premium, fashion, accessories",
        },
      };
    }

    res.json({
      success: true,
      siteSettings,
    });
  } catch (error) {
    console.error("Error fetching public site settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
    });
  }
});

// GET /api/banners - Get active banners for public display
router.get("/banners", async (req, res) => {
  try {
    const banners = await BannerSlider.find({ isActive: true })
      .select("-createdBy -updatedBy -createdAt -updatedAt -__v")
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching public banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
});

module.exports = router;
