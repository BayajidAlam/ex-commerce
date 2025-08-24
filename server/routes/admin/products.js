const express = require("express");
const { body, validationResult, param } = require("express-validator");
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
router.post(
  "/",
  auth,
  adminAuth,
  [
    // Basic product information validation
    body("name")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Product name must be between 3-100 characters")
      .notEmpty()
      .withMessage("Product name is required"),

    body("description")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10-1000 characters")
      .notEmpty()
      .withMessage("Description is required"),

    body("moreInfo")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Additional info must not exceed 500 characters"),

    body("returnPolicy")
      .optional()
      .isLength({ max: 300 })
      .withMessage("Return policy must not exceed 300 characters"),

    body("exchangePolicy")
      .optional()
      .isLength({ max: 300 })
      .withMessage("Exchange policy must not exceed 300 characters"),

    // Price validation
    body("price")
      .isNumeric()
      .withMessage("Price must be a number")
      .isFloat({ min: 0.01 })
      .withMessage("Price must be greater than 0")
      .custom((value) => {
        if (value > 1000000) {
          throw new Error("Price cannot exceed 1,000,000");
        }
        return true;
      }),

    // Category validation
    body("category")
      .isIn(["bag", "glass", "jewelry", "watch"])
      .withMessage("Category must be one of: bag, glass, jewelry, watch"),

    // SKU validation
    body("sku")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("SKU must be between 3-50 characters")
      .matches(/^[A-Z0-9\-_]+$/i)
      .withMessage(
        "SKU can only contain letters, numbers, hyphens, and underscores"
      )
      .notEmpty()
      .withMessage("SKU is required"),

    // Images validation
    body("images")
      .optional()
      .isArray()
      .withMessage("Images must be an array")
      .custom((images) => {
        if (images && images.length > 10) {
          throw new Error("Maximum 10 images allowed");
        }
        if (images) {
          for (let img of images) {
            if (!img.url || typeof img.url !== "string") {
              throw new Error("Each image must have a valid URL");
            }
            if (img.alt && typeof img.alt !== "string") {
              throw new Error("Image alt text must be a string");
            }
          }
        }
        return true;
      }),

    // Dimensions validation
    body("dimensions.length")
      .optional()
      .isNumeric()
      .withMessage("Length must be a number")
      .isFloat({ min: 0 })
      .withMessage("Length must be positive"),

    body("dimensions.width")
      .optional()
      .isNumeric()
      .withMessage("Width must be a number")
      .isFloat({ min: 0 })
      .withMessage("Width must be positive"),

    body("dimensions.height")
      .optional()
      .isNumeric()
      .withMessage("Height must be a number")
      .isFloat({ min: 0 })
      .withMessage("Height must be positive"),

    body("dimensions.weight")
      .optional()
      .isNumeric()
      .withMessage("Weight must be a number")
      .isFloat({ min: 0 })
      .withMessage("Weight must be positive"),

    body("dimensions.unit")
      .optional()
      .isIn(["cm", "inch"])
      .withMessage("Unit must be either 'cm' or 'inch'"),

    // Color variants validation
    body("colorVariants")
      .optional()
      .isArray()
      .withMessage("Color variants must be an array")
      .custom((variants) => {
        if (variants && variants.length > 20) {
          throw new Error("Maximum 20 color variants allowed");
        }
        if (variants) {
          for (let variant of variants) {
            if (!variant.colorName || typeof variant.colorName !== "string") {
              throw new Error(
                "Each color variant must have a valid color name"
              );
            }
            if (
              variant.stock &&
              (!Number.isInteger(Number(variant.stock)) ||
                Number(variant.stock) < 0)
            ) {
              throw new Error(
                "Color variant stock must be a non-negative integer"
              );
            }
          }
        }
        return true;
      }),

    // Discount validation
    body("discount.percentage")
      .optional()
      .isNumeric()
      .withMessage("Discount percentage must be a number")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0-100"),

    body("discount.isActive")
      .optional()
      .isBoolean()
      .withMessage("Discount active status must be boolean"),

    body("discount.validUntil")
      .optional()
      .isISO8601()
      .withMessage("Discount valid until must be a valid date"),

    // Featured status validation
    body("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured status must be boolean"),

    // Tags validation
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .custom((tags) => {
        if (tags && tags.length > 20) {
          throw new Error("Maximum 20 tags allowed");
        }
        if (tags) {
          for (let tag of tags) {
            if (typeof tag !== "string" || tag.length > 30) {
              throw new Error(
                "Each tag must be a string with maximum 30 characters"
              );
            }
          }
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
            value: error.value,
          })),
        });
      }

      const productData = req.body;

      // Check if SKU already exists
      const existingProduct = await Product.findOne({ sku: productData.sku });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "SKU already exists. Please use a unique SKU.",
        });
      }

      // Create new product with validated data
      const product = new Product({
        ...productData,
        seller: req.user.id,
      });

      await product.save();

      const populatedProduct = await Product.findById(product._id).populate(
        "seller",
        "firstName lastName email"
      );

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: populatedProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);

      // Handle specific MongoDB validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));

        return res.status(400).json({
          success: false,
          message: "Product validation failed",
          errors: validationErrors,
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${field} already exists. Please use a unique value.`,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PUT /api/admin/products/:id - Update product (admin only)
router.put(
  "/:id",
  auth,
  adminAuth,
  [
    // Product ID validation
    param("id").isMongoId().withMessage("Invalid product ID"),

    // All the same validations as POST, but optional since it's an update
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Product name must be between 3-100 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10-1000 characters"),

    body("moreInfo")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Additional info must not exceed 500 characters"),

    body("returnPolicy")
      .optional()
      .isLength({ max: 300 })
      .withMessage("Return policy must not exceed 300 characters"),

    body("exchangePolicy")
      .optional()
      .isLength({ max: 300 })
      .withMessage("Exchange policy must not exceed 300 characters"),

    body("price")
      .optional()
      .isNumeric()
      .withMessage("Price must be a number")
      .isFloat({ min: 0.01 })
      .withMessage("Price must be greater than 0")
      .custom((value) => {
        if (value > 1000000) {
          throw new Error("Price cannot exceed 1,000,000");
        }
        return true;
      }),

    body("category")
      .optional()
      .isIn(["bag", "glass", "jewelry", "watch"])
      .withMessage("Category must be one of: bag, glass, jewelry, watch"),

    body("sku")
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("SKU must be between 3-50 characters")
      .matches(/^[A-Z0-9\-_]+$/i)
      .withMessage(
        "SKU can only contain letters, numbers, hyphens, and underscores"
      ),

    body("images")
      .optional()
      .isArray()
      .withMessage("Images must be an array")
      .custom((images) => {
        if (images && images.length > 10) {
          throw new Error("Maximum 10 images allowed");
        }
        if (images) {
          for (let img of images) {
            if (!img.url || typeof img.url !== "string") {
              throw new Error("Each image must have a valid URL");
            }
            if (img.alt && typeof img.alt !== "string") {
              throw new Error("Image alt text must be a string");
            }
          }
        }
        return true;
      }),

    body("dimensions.length")
      .optional()
      .isNumeric()
      .withMessage("Length must be a number")
      .isFloat({ min: 0 })
      .withMessage("Length must be positive"),

    body("dimensions.width")
      .optional()
      .isNumeric()
      .withMessage("Width must be a number")
      .isFloat({ min: 0 })
      .withMessage("Width must be positive"),

    body("dimensions.height")
      .optional()
      .isNumeric()
      .withMessage("Height must be a number")
      .isFloat({ min: 0 })
      .withMessage("Height must be positive"),

    body("dimensions.weight")
      .optional()
      .isNumeric()
      .withMessage("Weight must be a number")
      .isFloat({ min: 0 })
      .withMessage("Weight must be positive"),

    body("dimensions.unit")
      .optional()
      .isIn(["cm", "inch"])
      .withMessage("Unit must be either 'cm' or 'inch'"),

    body("colorVariants")
      .optional()
      .isArray()
      .withMessage("Color variants must be an array")
      .custom((variants) => {
        if (variants && variants.length > 20) {
          throw new Error("Maximum 20 color variants allowed");
        }
        if (variants) {
          for (let variant of variants) {
            if (!variant.colorName || typeof variant.colorName !== "string") {
              throw new Error(
                "Each color variant must have a valid color name"
              );
            }
            if (
              variant.stock &&
              (!Number.isInteger(Number(variant.stock)) ||
                Number(variant.stock) < 0)
            ) {
              throw new Error(
                "Color variant stock must be a non-negative integer"
              );
            }
          }
        }
        return true;
      }),

    body("discount.percentage")
      .optional()
      .isNumeric()
      .withMessage("Discount percentage must be a number")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0-100"),

    body("discount.isActive")
      .optional()
      .isBoolean()
      .withMessage("Discount active status must be boolean"),

    body("discount.validUntil")
      .optional()
      .isISO8601()
      .withMessage("Discount valid until must be a valid date"),

    body("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured status must be boolean"),

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("Active status must be boolean"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .custom((tags) => {
        if (tags && tags.length > 20) {
          throw new Error("Maximum 20 tags allowed");
        }
        if (tags) {
          for (let tag of tags) {
            if (typeof tag !== "string" || tag.length > 30) {
              throw new Error(
                "Each tag must be a string with maximum 30 characters"
              );
            }
          }
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
            value: error.value,
          })),
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      // Check if product exists
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // If SKU is being updated, check for duplicates
      if (updateData.sku && updateData.sku !== existingProduct.sku) {
        const duplicateSKU = await Product.findOne({
          sku: updateData.sku,
          _id: { $ne: id },
        });
        if (duplicateSKU) {
          return res.status(400).json({
            success: false,
            message: "SKU already exists. Please use a unique SKU.",
          });
        }
      }

      // Update product with validated data
      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("seller", "firstName lastName email");

      res.json({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error);

      // Handle specific MongoDB validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));

        return res.status(400).json({
          success: false,
          message: "Product validation failed",
          errors: validationErrors,
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${field} already exists. Please use a unique value.`,
        });
      }

      // Handle invalid ObjectId
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID format",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// DELETE /api/admin/products/:id - Delete product (admin only)
router.delete(
  "/:id",
  auth,
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid product ID")],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
            value: error.value,
          })),
        });
      }

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

      // Handle invalid ObjectId
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID format",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

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
