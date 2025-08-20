const { body } = require('express-validator');

const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 2-30 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be between 2-30 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone(['bn-BD'])
    .withMessage('Please provide a valid Bangladeshi phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase, uppercase letter and number')
];

const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3-100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10-1000 characters'),
  body('price')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Price must be between 1-100000 BDT'),
  body('category')
    .isIn(['casual', 'formal', 'traditional', 'bag', 'jewellry', 'glass', 'watch'])
    .withMessage('Invalid category'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3-20 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, and hyphens')
];

module.exports = {
  registerValidation,
  productValidation
};