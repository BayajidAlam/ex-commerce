const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/categories");
const uploadRoutes = require("./routes/upload");
const siteSettingsRoutes = require("./routes/siteSettings");

// Admin routes
const adminProductRoutes = require("./routes/admin/products");
const adminOrderRoutes = require("./routes/admin/orders");
const adminUserRoutes = require("./routes/admin/users");
const adminSiteSettingsRoutes = require("./routes/admin/siteSettings");

// Models
const User = require("./models/User");

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
if (process.env.NODE_ENV === "production") {
  app.use("/api/", limiter);
} else {
  console.log("Rate limiter disabled in non-production");
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure admin user exists on every restart
async function ensureAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const forceReset =
      String(process.env.ADMIN_FORCE_RESET || "false").toLowerCase() === "true";

    if (!email || !password) {
      console.warn(
        "ADMIN_EMAIL or ADMIN_PASSWORD not set; skipping admin ensure."
      );
      return;
    }

    let user = await User.findOne({ email });

    if (user) {
      if (forceReset) {
        user.password = password; // hashed by pre-save hook
        user.isActive = true;
        user.role = "admin";
        await user.save();
        console.log("✅ Admin password reset:", email);
      } else {
        console.log("Admin user exists:", email);
      }
      return;
    }

    user = new User({
      firstName: "Admin",
      lastName: "User",
      email,
      phone: "+1234567890",
      password,
      role: "admin",
      isActive: true,
    });

    await user.save();
    console.log("✅ Admin user created:", email);
  } catch (err) {
    console.error("❌ Failed to ensure admin user:", err);
  }
}

// Helper to build internal Mongo URI when not provided (Docker Compose default)
function buildInternalMongoUri() {
  // Start with no-auth connection for fresh MongoDB containers
  return `mongodb://mongodb:27017/ex_commerce`;
}

// Alternative URI with auth for initialized containers
function buildInternalMongoUriWithAuth() {
  return `mongodb://admin:securepassword123@mongodb:27017/ex_commerce?authSource=admin`;
}

// MongoDB connection with fallback
async function connectToMongoDB() {
  const uriPrimary = process.env.MONGODB_URI || buildInternalMongoUri();

  try {
    await mongoose.connect(uriPrimary);
    console.log("MongoDB connected successfully");
    return;
  } catch (err) {
    console.log("Primary connection failed, trying with auth...");

    // If no custom URI provided and primary failed, try with auth
    if (!process.env.MONGODB_URI) {
      try {
        await mongoose.connect(buildInternalMongoUriWithAuth());
        console.log("MongoDB connected successfully (with auth)");
        return;
      } catch (authErr) {
        console.error("MongoDB connection failed with auth:", authErr.message);
        throw authErr;
      }
    }

    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

// MongoDB connection with fallback
connectToMongoDB()
  .then(async () => {
    // Minimal diag: confirm admin env presence
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn(
        "Admin env missing inside container. Ensure ADMIN_EMAIL and ADMIN_PASSWORD are passed at runtime."
      );
    }
    await ensureAdmin();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", siteSettingsRoutes);

// Admin routes
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminSiteSettingsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
