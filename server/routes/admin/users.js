const express = require("express");
const { body, validationResult, param } = require("express-validator");
const User = require("../../models/User");
const Order = require("../../models/Order");
const { auth } = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const router = express.Router();

// GET /api/admin/users - Get all users (admin only)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role && role !== "all") {
      query.role = role;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get users with pagination
    const users = await User.find(query)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent registrations
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total,
        limit: parseInt(limit),
      },
      stats: {
        total,
        byRole: userStats,
        recent: recentUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/admin/users/:id - Get user details (admin only)
router.get(
  "/:id",
  auth,
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
          errors: errors.array(),
        });
      }

      const { id } = req.params;

      const user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user's orders
      const orders = await Order.find({ user: id })
        .populate("items.product", "name price images")
        .sort({ createdAt: -1 })
        .limit(10);

      // Get user statistics
      const userStats = await Order.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]);

      res.json({
        success: true,
        user: {
          ...user.toObject(),
          orders,
          stats: userStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            avgOrderValue: 0,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PUT /api/admin/users/:id - Update user (admin only)
router.put(
  "/:id",
  auth,
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid user ID"),

    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2-50 characters"),

    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2-50 characters"),

    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),

    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Please provide a valid phone number"),

    body("role")
      .optional()
      .isIn(["user", "seller", "admin"])
      .withMessage("Role must be one of: user, seller, admin"),

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("Active status must be boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const updates = req.body;

      // Don't allow updating password through this route
      delete updates.password;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // If email is being updated, check if it's already taken
      if (updates.email && updates.email !== user.email) {
        const existingUser = await User.findOne({ email: updates.email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// DELETE /api/admin/users/:id - Delete user (admin only)
router.delete(
  "/:id",
  auth,
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
          errors: errors.array(),
        });
      }

      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Don't allow deleting admin users
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Cannot delete admin users",
        });
      }

      // Check if user has orders
      const orderCount = await Order.countDocuments({ user: id });
      if (orderCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete user with ${orderCount} orders. Consider deactivating instead.`,
        });
      }

      await User.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);

      // Handle invalid ObjectId
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PATCH /api/admin/users/:id/toggle-active - Toggle user active status
router.patch(
  "/:id/toggle-active",
  auth,
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
          errors: errors.array(),
        });
      }

      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Don't allow deactivating admin users
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Cannot deactivate admin users",
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        success: true,
        message: `User ${
          user.isActive ? "activated" : "deactivated"
        } successfully`,
        user: {
          ...user.toObject(),
          password: undefined,
        },
      });
    } catch (error) {
      console.error("Error toggling user active status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
