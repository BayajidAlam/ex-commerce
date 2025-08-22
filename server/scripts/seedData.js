const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aluna-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sellers
    const sellers = [
      {
        firstName: 'Aluna',
        lastName: 'Store',
        email: 'seller@aluna.com',
        phone: '+8801712345678',
        password: 'seller123',
        role: 'seller'
      },
      {
        firstName: 'Fashion',
        lastName: 'Hub',
        email: 'fashion@aluna.com',
        phone: '+8801787654321',
        password: 'seller123',
        role: 'seller'
      }
    ];

    const createdSellers = await User.insertMany(sellers);
    console.log('Sellers created:', createdSellers.length);

    // Create sample products
    const products = [
      {
        name: 'Cotton Casual Shirt',
        description: 'Premium cotton casual shirt perfect for everyday wear. Soft fabric with comfortable fit.',
        price: 1200,
        category: 'casual',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Cotton Casual Shirt' }],
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 }
        ],
        colors: ['White', 'Blue', 'Gray'],
        sku: 'ALN-CCS-001',
        seller: createdSellers[0]._id,
        featured: true,
        tags: ['cotton', 'casual', 'comfortable'],
        inStock: true
      },
      {
        name: 'Formal White Shirt',
        description: 'Classic formal white shirt for business and special occasions. Crisp cotton blend.',
        price: 1500,
        category: 'formal',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Formal White Shirt' }],
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 }
        ],
        colors: ['White'],
        sku: 'ALN-FWS-002',
        seller: createdSellers[0]._id,
        featured: true,
        tags: ['formal', 'business', 'white'],
        inStock: true
      },
      {
        name: 'Denim Casual Shirt',
        description: 'Stylish denim shirt for casual outings. Durable and trendy design.',
        price: 1800,
        category: 'casual',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Denim Casual Shirt' }],
        sizes: [
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 }
        ],
        colors: ['Light Blue', 'Dark Blue'],
        sku: 'ALN-DCS-003',
        seller: createdSellers[1]._id,
        tags: ['denim', 'casual', 'trendy'],
        inStock: true
      },
      {
        name: 'Black Kurta',
        description: 'Traditional black kurta for cultural events and festivals. Premium fabric with intricate design.',
        price: 2200,
        category: 'traditional',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Black Kurta' }],
        sizes: [
          { size: 'S', stock: 6 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 }
        ],
        colors: ['Black'],
        sku: 'ALN-BK-004',
        seller: createdSellers[0]._id,
        featured: true,
        tags: ['traditional', 'kurta', 'festival'],
        inStock: true
      },
      {
        name: 'White Panjabi',
        description: 'Elegant white panjabi for special occasions. Traditional design with modern comfort.',
        price: 2500,
        category: 'traditional',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'White Panjabi' }],
        sizes: [
          { size: 'M', stock: 8 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 4 }
        ],
        colors: ['White', 'Cream'],
        sku: 'ALN-WP-005',
        seller: createdSellers[1]._id,
        tags: ['traditional', 'panjabi', 'elegant'],
        inStock: true
      },
      {
        name: 'Navy Kurta',
        description: 'Sophisticated navy kurta suitable for both casual and semi-formal events.',
        price: 2000,
        category: 'traditional',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Navy Kurta' }],
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 6 }
        ],
        colors: ['Navy'],
        sku: 'ALN-NK-006',
        seller: createdSellers[0]._id,
        tags: ['traditional', 'navy', 'versatile']
      },
      {
        name: 'Pink Casual Shirt',
        description: 'Trendy pink casual shirt for a fresh and vibrant look. Soft cotton fabric.',
        price: 1600,
        category: 'casual',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Pink Casual Shirt' }],
        sizes: [
          { size: 'S', stock: 7 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 }
        ],
        colors: ['Pink', 'Light Pink'],
        sku: 'ALN-PCS-007',
        seller: createdSellers[1]._id,
        tags: ['casual', 'pink', 'trendy']
      },
      {
        name: 'Striped Formal Shirt',
        description: 'Professional striped formal shirt for office wear. Classic design with modern fit.',
        price: 1900,
        category: 'formal',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Striped Formal Shirt' }],
        sizes: [
          { size: 'M', stock: 12 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 }
        ],
        colors: ['Blue Stripe', 'Gray Stripe'],
        sku: 'ALN-SFS-008',
        seller: createdSellers[0]._id,
        tags: ['formal', 'striped', 'office']
      },
      {
        name: 'Leather Bag',
        description: 'Premium leather bag for everyday use. Spacious and durable with elegant design.',
        price: 3500,
        category: 'bag',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Leather Bag' }],
        sizes: [{ size: 'One Size', stock: 15 }],
        colors: ['Brown', 'Black', 'Tan'],
        sku: 'ALN-LB-009',
        seller: createdSellers[1]._id,
        featured: true,
        tags: ['leather', 'bag', 'premium']
      },
      {
        name: 'Silver Watch',
        description: 'Elegant silver watch with precise movement. Perfect accessory for any outfit.',
        price: 4200,
        category: 'watch',
        images: [{ url: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg', alt: 'Silver Watch' }],
        sizes: [{ size: 'One Size', stock: 8 }],
        colors: ['Silver'],
        sku: 'ALN-SW-010',
        seller: createdSellers[0]._id,
        tags: ['watch', 'silver', 'elegant']
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log('Products created:', createdProducts.length);

    // Create a sample user
    const sampleUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      phone: '+8801912345678',
      password: 'user123',
      role: 'user'
    });
    await sampleUser.save();
    console.log('Sample user created');

    console.log('\n=== SEED DATA COMPLETED ===');
    console.log('\nLogin Credentials:');
    console.log('Seller 1: seller@aluna.com / seller123');
    console.log('Seller 2: fashion@aluna.com / seller123');
    console.log('User: user@example.com / user123');
    console.log('\nTotal Products:', createdProducts.length);
    console.log('Featured Products:', createdProducts.filter(p => p.featured).length);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();