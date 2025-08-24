const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
require("dotenv").config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/aluna-ecommerce"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create sellers (let the User model handle password hashing)
    const sellers = [
      {
        firstName: "Aluna",
        lastName: "Store",
        email: "seller@aluna.com",
        phone: "+8801712345678",
        password: "seller123",
        role: "seller",
      },
      {
        firstName: "Fashion",
        lastName: "Hub",
        email: "fashion@aluna.com",
        phone: "+8801787654321",
        password: "seller123",
        role: "seller",
      },
    ];

    const createdSellers = await User.insertMany(sellers);
    console.log("Sellers created:", createdSellers.length);

    // Create sample products with 4 categories: bag, glass, jewelry, watch
    const products = [
      // Bags
      {
        name: "Leather Handbag",
        description:
          "Premium leather handbag perfect for everyday use. Spacious compartments with elegant design.",
        moreInfo:
          "Made from genuine leather with brass hardware. Multiple pockets for organization.",
        price: 2500,
        category: "bag",
        images: [
          {
            url: "https://i.ibb.co/placeholder-bag1.jpg",
            alt: "Leather Handbag",
          },
        ],
        colorVariants: [
          { colorName: "Black", colorCode: "#000000", stock: 15, images: [] },
          { colorName: "Brown", colorCode: "#8B4513", stock: 12, images: [] },
          { colorName: "Tan", colorCode: "#D2B48C", stock: 8, images: [] },
        ],
        sizes: [
          { size: "Medium", stock: 20 },
          { size: "Large", stock: 15 },
        ],
        dimensions: {
          length: 35,
          width: 25,
          height: 15,
          weight: 800,
          unit: "cm",
        },
        sku: "ALN-BAG-001",
        seller: createdSellers[0]._id,
        featured: true,
        tags: ["leather", "handbag", "elegant"],
        inStock: true,
      },
      {
        name: "Canvas Backpack",
        description:
          "Durable canvas backpack for travel and daily use. Water-resistant with multiple compartments.",
        moreInfo:
          "Heavy-duty canvas material with reinforced stitching. Laptop compartment included.",
        price: 1800,
        category: "bag",
        images: [
          {
            url: "https://i.ibb.co/placeholder-bag2.jpg",
            alt: "Canvas Backpack",
          },
        ],
        colorVariants: [
          {
            colorName: "Navy Blue",
            colorCode: "#000080",
            stock: 20,
            images: [],
          },
          { colorName: "Khaki", colorCode: "#F0E68C", stock: 15, images: [] },
          { colorName: "Black", colorCode: "#000000", stock: 18, images: [] },
        ],
        sizes: [
          { size: "Small", stock: 10 },
          { size: "Medium", stock: 25 },
          { size: "Large", stock: 18 },
        ],
        dimensions: {
          length: 45,
          width: 30,
          height: 20,
          weight: 1200,
          unit: "cm",
        },
        sku: "ALN-BAG-002",
        seller: createdSellers[1]._id,
        featured: false,
        tags: ["canvas", "backpack", "travel"],
        inStock: true,
      },

      // Glasses
      {
        name: "Aviator Sunglasses",
        description:
          "Classic aviator sunglasses with UV protection. Timeless style for any occasion.",
        moreInfo:
          "Polarized lenses with anti-glare coating. Durable metal frame with adjustable nose pads.",
        price: 1200,
        category: "glass",
        images: [
          {
            url: "https://i.ibb.co/placeholder-glass1.jpg",
            alt: "Aviator Sunglasses",
          },
        ],
        colorVariants: [
          {
            colorName: "Gold Frame",
            colorCode: "#FFD700",
            stock: 25,
            images: [],
          },
          {
            colorName: "Silver Frame",
            colorCode: "#C0C0C0",
            stock: 20,
            images: [],
          },
          {
            colorName: "Black Frame",
            colorCode: "#000000",
            stock: 30,
            images: [],
          },
        ],
        sizes: [{ size: "Standard", stock: 75 }],
        dimensions: {
          length: 14,
          width: 13,
          height: 5,
          weight: 45,
          unit: "cm",
        },
        sku: "ALN-GLS-001",
        seller: createdSellers[0]._id,
        featured: true,
        tags: ["sunglasses", "aviator", "UV protection"],
        inStock: true,
      },
      {
        name: "Reading Glasses",
        description:
          "Comfortable reading glasses with anti-blue light coating. Perfect for screen time.",
        moreInfo:
          "Blue light blocking technology to reduce eye strain. Lightweight plastic frame.",
        price: 800,
        category: "glass",
        images: [
          {
            url: "https://i.ibb.co/placeholder-glass2.jpg",
            alt: "Reading Glasses",
          },
        ],
        colorVariants: [
          { colorName: "Black", colorCode: "#000000", stock: 40, images: [] },
          {
            colorName: "Tortoise",
            colorCode: "#8B4513",
            stock: 35,
            images: [],
          },
          { colorName: "Clear", colorCode: "#FFFFFF", stock: 25, images: [] },
        ],
        sizes: [
          { size: "+1.0", stock: 20 },
          { size: "+1.5", stock: 30 },
          { size: "+2.0", stock: 25 },
          { size: "+2.5", stock: 25 },
        ],
        dimensions: {
          length: 13,
          width: 12,
          height: 4,
          weight: 25,
          unit: "cm",
        },
        sku: "ALN-GLS-002",
        seller: createdSellers[1]._id,
        featured: false,
        tags: ["reading", "blue light", "computer"],
        inStock: true,
      },

      // Jewelry
      {
        name: "Gold Chain Necklace",
        description:
          "Elegant 18k gold plated chain necklace. Perfect for special occasions and daily wear.",
        moreInfo:
          "High-quality gold plating over sterling silver base. Hypoallergenic and tarnish-resistant.",
        price: 3500,
        category: "jewelry",
        images: [
          {
            url: "https://i.ibb.co/placeholder-jewelry1.jpg",
            alt: "Gold Chain Necklace",
          },
        ],
        colorVariants: [
          { colorName: "Gold", colorCode: "#FFD700", stock: 15, images: [] },
          {
            colorName: "Rose Gold",
            colorCode: "#E8B4A0",
            stock: 12,
            images: [],
          },
        ],
        sizes: [
          { size: "16 inch", stock: 10 },
          { size: "18 inch", stock: 15 },
          { size: "20 inch", stock: 12 },
        ],
        dimensions: {
          length: 50,
          width: 0.3,
          height: 0.2,
          weight: 15,
          unit: "cm",
        },
        sku: "ALN-JWL-001",
        seller: createdSellers[0]._id,
        featured: true,
        tags: ["necklace", "gold", "chain"],
        inStock: true,
      },
      {
        name: "Diamond Stud Earrings",
        description:
          "Sparkling cubic zirconia stud earrings. Brilliant cut stones in secure settings.",
        moreInfo:
          "AAA grade cubic zirconia stones. Sterling silver posts with butterfly backs.",
        price: 1500,
        category: "jewelry",
        images: [
          {
            url: "https://i.ibb.co/placeholder-jewelry2.jpg",
            alt: "Diamond Stud Earrings",
          },
        ],
        colorVariants: [
          { colorName: "Clear", colorCode: "#FFFFFF", stock: 25, images: [] },
          { colorName: "Pink", colorCode: "#FFC0CB", stock: 15, images: [] },
        ],
        sizes: [
          { size: "4mm", stock: 20 },
          { size: "6mm", stock: 15 },
          { size: "8mm", stock: 10 },
        ],
        dimensions: {
          length: 1,
          width: 1,
          height: 0.5,
          weight: 2,
          unit: "cm",
        },
        sku: "ALN-JWL-002",
        seller: createdSellers[1]._id,
        featured: false,
        tags: ["earrings", "diamond", "stud"],
        inStock: true,
      },

      // Watches
      {
        name: "Luxury Sports Watch",
        description:
          "Premium sports watch with chronograph function. Water-resistant and durable.",
        moreInfo:
          "Swiss movement with sapphire crystal. 50m water resistance with luminous hands.",
        price: 8500,
        category: "watch",
        images: [
          {
            url: "https://i.ibb.co/placeholder-watch1.jpg",
            alt: "Luxury Sports Watch",
          },
        ],
        colorVariants: [
          { colorName: "Black", colorCode: "#000000", stock: 10, images: [] },
          { colorName: "Blue", colorCode: "#0000FF", stock: 8, images: [] },
          { colorName: "Silver", colorCode: "#C0C0C0", stock: 12, images: [] },
        ],
        sizes: [
          { size: "40mm", stock: 15 },
          { size: "42mm", stock: 15 },
        ],
        dimensions: {
          length: 4.2,
          width: 4.2,
          height: 1.2,
          weight: 150,
          unit: "cm",
        },
        sku: "ALN-WTC-001",
        seller: createdSellers[0]._id,
        featured: true,
        tags: ["watch", "sports", "chronograph"],
        inStock: true,
      },
      {
        name: "Classic Dress Watch",
        description:
          "Elegant dress watch with leather strap. Perfect for formal occasions.",
        moreInfo:
          "Japanese quartz movement with date display. Genuine leather strap with deployment clasp.",
        price: 4500,
        category: "watch",
        images: [
          {
            url: "https://i.ibb.co/placeholder-watch2.jpg",
            alt: "Classic Dress Watch",
          },
        ],
        colorVariants: [
          {
            colorName: "Black Leather",
            colorCode: "#000000",
            stock: 18,
            images: [],
          },
          {
            colorName: "Brown Leather",
            colorCode: "#8B4513",
            stock: 15,
            images: [],
          },
        ],
        sizes: [
          { size: "38mm", stock: 20 },
          { size: "40mm", stock: 13 },
        ],
        dimensions: {
          length: 4.0,
          width: 4.0,
          height: 0.8,
          weight: 85,
          unit: "cm",
        },
        sku: "ALN-WTC-002",
        seller: createdSellers[1]._id,
        featured: false,
        tags: ["watch", "dress", "formal"],
        inStock: true,
      },
    ];

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log("Products created:", createdProducts.length);

    // Create admin user (let the User model handle password hashing)
    const adminUser = {
      firstName: "Admin",
      lastName: "User",
      email: process.env.ADMIN_EMAIL || "admin@arjo.com",
      phone: "+8801700000000",
      password: process.env.ADMIN_PASSWORD || "amin@aro",
      role: "admin",
    };

    await User.create(adminUser);
    console.log("Admin user created with email:", adminUser.email);

    console.log("✅ Seed data created successfully!");
    console.log("📊 Summary:");
    console.log(`- ${createdSellers.length} sellers created`);
    console.log(`- ${createdProducts.length} products created:`);
    console.log(
      `  • ${products.filter((p) => p.category === "bag").length} bags`
    );
    console.log(
      `  • ${products.filter((p) => p.category === "glass").length} glasses`
    );
    console.log(
      `  • ${products.filter((p) => p.category === "jewelry").length} jewelry`
    );
    console.log(
      `  • ${products.filter((p) => p.category === "watch").length} watches`
    );
    console.log("- 1 admin user created");
    console.log("");
    console.log("🔑 Admin Login Credentials:");
    console.log(`Email: ${process.env.ADMIN_EMAIL || "admin@arjo.com"}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "amin@aro"}`);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();
