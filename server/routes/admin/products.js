const express = require("express");
const Product = require("../../models/Product");
const { auth } = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const router = express.Router();

// GET /api/admin/products - Get all products (admin only)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/admin/products - Create new product (admin only)
router.post("/", auth, adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      sku,
      featured,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !sku) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists",
      });
    }

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      category,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      sku,
      featured: featured || false,
      seller: req.user.id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/admin/products/:id - Update product (admin only)
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If SKU is being updated, check for duplicates
    if (updateData.sku) {
      const existingProduct = await Product.findOne({
        sku: updateData.sku,
        _id: { $ne: id },
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "SKU already exists",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/admin/products/:id - Delete product (admin only)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/admin/products/:id - Get single product (admin only)
router.get("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PATCH /api/admin/products/:id/toggle-featured - Toggle featured status
router.patch("/:id/toggle-featured", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.json({
      success: true,
      message: `Product ${
        product.featured ? "added to" : "removed from"
      } featured products`,
      product,
    });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PATCH /api/admin/products/:id/toggle-active - Toggle active status
router.patch("/:id/toggle-active", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? "activated" : "deactivated"}`,
      product,
    });
  } catch (error) {
    console.error("Error toggling active status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
