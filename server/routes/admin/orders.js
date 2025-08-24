const express = require("express");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const { auth } = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

// GET /api/admin/orders - Get all orders (admin only)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;

    let query = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/admin/orders/stats - Get admin dashboard statistics
router.get("/stats", auth, adminAuth, async (req, res) => {
  try {
    console.log("📊 Stats endpoint called");

    // Debug: Check if there are any orders at all
    const allOrders = await Order.find().limit(5);
    console.log("Sample orders:", allOrders);

    const [totalOrders, totalRevenue, pendingOrders, totalProducts] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Order.countDocuments({ status: "pending" }),
        Product.countDocuments({ isActive: true }),
      ]);

    const revenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    console.log("📊 Stats calculation:");
    console.log("- Total Orders:", totalOrders);
    console.log("- Revenue Query Result:", totalRevenue);
    console.log("- Calculated Revenue:", revenueAmount);
    console.log("- Pending Orders:", pendingOrders);
    console.log("- Total Products:", totalProducts);

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ["confirmed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: revenueAmount,
        pendingOrders,
        totalProducts,
        monthlyRevenue,
        statusDistribution,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/admin/orders/:id - Get single order (admin only)
router.get("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "firstName lastName name email phone")
      .populate("items.product", "name price images sku");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Calculate derived fields
    const orderWithCalculations = {
      ...order.toObject(),
      subtotal: order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    };

    res.json({
      success: true,
      order: orderWithCalculations,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/admin/orders/:id/status - Update order status (admin only)
router.put("/:id/status", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Populate the updated order for response
    const updatedOrder = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/admin/orders/:id - Delete order (admin only)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/admin/orders/:id - Update order details (admin only)
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.user;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
