const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/aluna-ecommerce"
    );
    console.log("Connected to MongoDB");

    // Create admin user (let the User model handle password hashing)
    const adminUser = {
      firstName: "Admin",
      lastName: "User",
      email: process.env.ADMIN_EMAIL,
      phone: "+8801860301407",
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    };

    await User.create(adminUser);
    console.log("Admin user created with email:", adminUser.email);

    console.log("🔑 Admin Login Credentials:");
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();
