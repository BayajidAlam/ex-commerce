const express = require("express");
const { body, validationResult } = require("express-validator");
const { SiteSettings, BannerSlider } = require("../../models/SiteSettings");
const { auth } = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

// ================== SITE SETTINGS ROUTES ==================

// GET /api/admin/site-settings - Get current site settings
router.get("/site-settings", auth, adminAuth, async (req, res) => {
  try {
    let siteSettings = await SiteSettings.findOne().populate(
      "updatedBy",
      "firstName lastName"
    );

    // If no settings exist, create default ones
    if (!siteSettings) {
      siteSettings = new SiteSettings({
        updatedBy: req.user._id,
      });
      await siteSettings.save();
      await siteSettings.populate("updatedBy", "firstName lastName");
    }

    res.json({
      success: true,
      siteSettings,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
    });
  }
});

// PUT /api/admin/site-settings - Update site settings
router.put(
  "/site-settings",
  auth,
  adminAuth,
  [
    body("siteName").trim().notEmpty().withMessage("Site name is required"),
    body("description").optional().trim(),
    body("contactEmail")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),
    body("contactPhone").optional().trim(),
    body("address").optional().trim(),
    body("logoUrl")
      .optional()
      .isURL()
      .withMessage("Valid logo URL is required"),
    body("faviconUrl")
      .optional()
      .isURL()
      .withMessage("Valid favicon URL is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const updateData = {
        ...req.body,
        updatedBy: req.user._id,
      };

      let siteSettings = await SiteSettings.findOne();

      if (!siteSettings) {
        siteSettings = new SiteSettings(updateData);
      } else {
        Object.assign(siteSettings, updateData);
      }

      await siteSettings.save();
      await siteSettings.populate("updatedBy", "firstName lastName");

      res.json({
        success: true,
        message: "Site settings updated successfully",
        siteSettings,
      });
    } catch (error) {
      console.error("Error updating site settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update site settings",
      });
    }
  }
);

// ================== BANNER SLIDER ROUTES ==================

// GET /api/admin/banners - Get all banners for admin
router.get("/banners", auth, adminAuth, async (req, res) => {
  try {
    const banners = await BannerSlider.find()
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName")
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
});

// POST /api/admin/banners - Create new banner
router.post(
  "/banners",
  auth,
  adminAuth,
  [
    body("title").trim().notEmpty().withMessage("Banner title is required"),
    body("subtitle").optional().trim(),
    body("image.url").notEmpty().withMessage("Banner image URL is required"),
    body("image.public_id")
      .notEmpty()
      .withMessage("Image public ID is required"),
    body("buttonText").optional().trim(),
    body("buttonLink").optional().trim(),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a positive integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const bannerData = {
        ...req.body,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      };

      const banner = new BannerSlider(bannerData);
      await banner.save();

      await banner.populate("createdBy", "firstName lastName");
      await banner.populate("updatedBy", "firstName lastName");

      res.status(201).json({
        success: true,
        message: "Banner created successfully",
        banner,
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create banner",
      });
    }
  }
);

// PUT /api/admin/banners/:id - Update banner
router.put(
  "/banners/:id",
  auth,
  adminAuth,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Banner title cannot be empty"),
    body("subtitle").optional().trim(),
    body("image.url")
      .optional()
      .notEmpty()
      .withMessage("Banner image URL cannot be empty"),
    body("image.public_id")
      .optional()
      .notEmpty()
      .withMessage("Image public ID cannot be empty"),
    body("buttonText").optional().trim(),
    body("buttonLink").optional().trim(),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a positive integer"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const banner = await BannerSlider.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Banner not found",
        });
      }

      const updateData = {
        ...req.body,
        updatedBy: req.user._id,
      };

      Object.assign(banner, updateData);
      await banner.save();

      await banner.populate("createdBy", "firstName lastName");
      await banner.populate("updatedBy", "firstName lastName");

      res.json({
        success: true,
        message: "Banner updated successfully",
        banner,
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update banner",
      });
    }
  }
);

// DELETE /api/admin/banners/:id - Delete banner
router.delete("/banners/:id", auth, adminAuth, async (req, res) => {
  try {
    const banner = await BannerSlider.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await BannerSlider.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
});

// PATCH /api/admin/banners/:id/toggle-status - Toggle banner active status
router.patch(
  "/banners/:id/toggle-status",
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const banner = await BannerSlider.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Banner not found",
        });
      }

      banner.isActive = !banner.isActive;
      banner.updatedBy = req.user._id;
      await banner.save();

      await banner.populate("createdBy", "firstName lastName");
      await banner.populate("updatedBy", "firstName lastName");

      res.json({
        success: true,
        message: `Banner ${
          banner.isActive ? "activated" : "deactivated"
        } successfully`,
        banner,
      });
    } catch (error) {
      console.error("Error toggling banner status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle banner status",
      });
    }
  }
);

module.exports = router;
