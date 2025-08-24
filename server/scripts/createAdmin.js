const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import User model
const User = require("../models/User");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: process.env.ADMIN_EMAIL }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      12
    );

    // Create admin user
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: process.env.ADMIN_EMAIL,
      phone: "+1234567890",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      address: {
        street: "Admin Street",
        city: "Admin City",
        state: "Admin State",
        zipCode: "12345",
        country: "Admin Country",
      },
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminUser.email);
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "admin123");
    console.log("🛡️ Role:", adminUser.role);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdmin();
