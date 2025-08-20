const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all categories with product counts
router.get('/', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const formattedCategories = categories.map(cat => ({
      id: cat._id,
      name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
      count: cat.count
    }));

    res.json({ categories: formattedCategories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
