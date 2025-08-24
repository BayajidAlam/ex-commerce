const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const User = require("../models/User");

    // Hash the password from .env
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    // Update or create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL },
      {
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
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin user updated/created successfully!");
    console.log("📧 Email:", adminUser.email);
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD);
    console.log("🛡️ Role:", adminUser.role);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

resetAdminPassword();
