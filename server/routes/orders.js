const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('items.*.product').notEmpty().withMessage('Product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('shippingAddress.firstName').trim().notEmpty().withMessage('First name required'),
  body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    console.log('📦 Order creation request:', JSON.stringify(req.body, null, 2));
    console.log('👤 User:', req.user.firstName, req.user.lastName);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      notes, 
      transactionId, 
      totalAmount,
      shipping,
      tax 
    } = req.body;

    // Validate products and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    console.log(`🔍 Processing ${items.length} items...`);

    for (const item of items) {
      console.log('Processing item:', item);
      
      // Handle both _id and id formats
      const productId = item.product || item.id;
      
      if (!productId) {
        console.log('❌ Missing product ID in item:', item);
        return res.status(400).json({ error: 'Product ID is required for all items' });
      }

      // Check if it's a valid MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.log('❌ Invalid product ID format:', productId);
        return res.status(400).json({ error: `Invalid product ID format: ${productId}` });
      }

      const product = await Product.findById(productId);
      console.log('Found product:', product ? product.name : 'NOT FOUND');

      if (!product) {
        console.log('❌ Product not found:', productId);
        return res.status(400).json({ error: `Product ${productId} not found` });
      }

      if (!product.isActive) {
        console.log('❌ Product not active:', productId);
        return res.status(400).json({ error: `Product ${product.name} is not available` });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color
      });
    }

    // Add shipping and tax to calculated total
    const finalTotal = calculatedTotal + (shipping || 0) + (tax || 0);

    console.log('💰 Calculated total:', calculatedTotal);
    console.log('🚚 Shipping:', shipping || 0);
    console.log('💸 Tax:', tax || 0);
    console.log('🧮 Final total:', finalTotal);
    console.log('📝 Provided total:', totalAmount);

    // Validate total amount (allow small rounding differences)
    if (Math.abs(finalTotal - totalAmount) > 1) {
      console.log('❌ Total amount mismatch');
      return res.status(400).json({ 
        error: 'Total amount mismatch',
        calculated: finalTotal,
        provided: totalAmount
      });
    }

    // Generate order number
    const orderNumber = `ALN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    console.log('🔢 Generated order number:', orderNumber);

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: finalTotal,
      shipping: shipping || 0,
      tax: tax || 0,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      transactionId,
      notes,
      orderNumber
    });

    console.log('💾 Saving order...');
    await order.save();
    console.log('✅ Order saved with ID:', order._id);

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images price');

    console.log('✅ Order created successfully');

    res.status(201).json({
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate('items.product', 'name images price category')
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
