const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Product = require("../models/Product");
const { auth, sellerAuth } = require("../middleware/auth");

const router = express.Router();

// Autocomplete search endpoint for search suggestions
router.get(
  "/search/autocomplete",
  [query("q").notEmpty().trim().withMessage("Search query is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const searchQuery = req.query.q;

      // Search for products with name matching the query (case-insensitive)
      const products = await Product.find({
        isActive: true,
        name: { $regex: searchQuery, $options: "i" },
      })
        .select("_id name price images category")
        .limit(10)
        .sort({ name: 1 });

      const suggestions = products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0
            ? product.images[0].url
            : null,
        category: product.category,
      }));

      res.json({ suggestions });
    } catch (error) {
      console.error("Autocomplete search error:", error);
      res.status(500).json({
        message: "Error fetching search suggestions",
        error: error.message,
      });
    }
  }
);

// Get all products with filtering and pagination
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("category").optional().trim(),
    query("search").optional().trim(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("sortBy").optional().isIn(["name", "price", "createdAt", "rating"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build query
      let query = { isActive: true };

      if (req.query.category) {
        query.category = req.query.category;
      }

      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { category: { $regex: req.query.search, $options: "i" } },
        ];
      }

      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice)
          query.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice)
          query.price.$lte = parseFloat(req.query.maxPrice);
      }

      // Build sort
      let sort = {};
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      sort[sortBy] = sortOrder;

      const products = await Product.find(query)
        .populate("seller", "firstName lastName")
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
);

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("seller", "firstName lastName email phone");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product (Sellers only)
router.post(
  "/",
  sellerAuth,
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("category")
      .isIn([
        "casual",
        "formal",
        "traditional",
        "bag",
        "jewellry",
        "glass",
        "watch",
      ])
      .withMessage("Invalid category"),
    body("sku").trim().notEmpty().withMessage("SKU is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productData = {
        ...req.body,
        seller: req.user._id,
      };

      const product = new Product(productData);
      await product.save();

      const populatedProduct = await Product.findById(product._id).populate(
        "seller",
        "firstName lastName"
      );

      res.status(201).json({
        message: "Product created successfully",
        product: populatedProduct,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ error: "Product with this SKU already exists" });
      }
      console.error("Create product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// Update product (Sellers only - own products)
router.put(
  "/:id",
  sellerAuth,
  [
    body("name").optional().trim().notEmpty(),
    body("description").optional().trim().notEmpty(),
    body("price").optional().isFloat({ min: 0 }),
    body("category")
      .optional()
      .isIn([
        "casual",
        "formal",
        "traditional",
        "bag",
        "jewellry",
        "glass",
        "watch",
      ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        seller: req.user._id,
      });
      if (!product) {
        return res
          .status(404)
          .json({ error: "Product not found or access denied" });
      }

      Object.assign(product, req.body);
      await product.save();

      const updatedProduct = await Product.findById(product._id).populate(
        "seller",
        "firstName lastName"
      );

      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

// Delete product (Sellers only - own products)
router.delete("/:id", sellerAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or access denied" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate("seller", "firstName lastName")
      .limit(10);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

// Get most sold products (using rating as a proxy for sales)
router.get("/most-sold", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    // Sort by rating and featured status to simulate most sold
    const products = await Product.find({ isActive: true })
      .populate("seller", "firstName lastName")
      .sort({
        featured: -1, // Featured products first
        "rating.average": -1, // Then by rating
        "rating.count": -1, // Then by number of ratings
        createdAt: -1, // Finally by newest
      })
      .limit(limit);

    res.json({ products });
  } catch (error) {
    console.error("Error fetching most sold products:", error);
    res.status(500).json({ error: "Failed to fetch most sold products" });
  }
});

module.exports = router;
